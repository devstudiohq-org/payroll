import { jsPDF } from 'jspdf';
import autoTable, { type RowInput } from 'jspdf-autotable';
import type { CompanyDto, PayrollRunDto, PayslipLine } from '@starter/types';

import { buildPayslipDocument, type PayslipEntry } from './payslip';

const money = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function fmt(value: number): string {
  return `$${money.format(value)}`;
}

function lastY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
}

/** Render one employee's payslip block starting at startY and return the Y it ended at. */
function renderPayslip(
  doc: jsPDF,
  companyName: string,
  periodEnding: string,
  runDate: string,
  cycle: number,
  entry: PayslipEntry,
  index: number,
  startY: number,
): number {
  const { line, ytd } = entry;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Title
  doc.setFont('helvetica', 'bold').setFontSize(12);
  doc.text(`${companyName.toUpperCase()} PAYSLIP`, pageWidth / 2, startY, { align: 'center' });
  doc.setFont('helvetica', 'normal').setFontSize(9);
  doc.text(`PAY PERIOD ENDING: ${periodEnding}`, pageWidth / 2, startY + 5, { align: 'center' });
  doc.text(`Run Date: ${runDate}`, pageWidth - margin, startY, { align: 'right' });
  doc.text(`CYCLE #: ${cycle}`, pageWidth - margin, startY + 5, { align: 'right' });

  // Employee identity block
  const idY = startY + 12;
  doc.setFontSize(9);
  doc.text(`IDNo: ${index + 1}`, margin, idY);
  doc.setFont('helvetica', 'bold');
  doc.text(line.name.toUpperCase(), margin, idY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIS #: ${line.nis}`, margin, idY + 10);
  doc.text(`TRN: ${line.trn}`, margin, idY + 15);
  doc.text(`Job.: ${line.role}`, pageWidth / 2, idY + 5);
  doc.text(`TAXABLE PAY: ${fmt(line.grossPay)}`, pageWidth / 2, idY + 15);

  // Income column: basic pay plus any additions (overtime, bonus…).
  const incomeItems: Array<[string, string]> = [['BASIC PAY', fmt(line.baseGross)]];
  for (const add of line.additions) {
    incomeItems.push([add.label.toUpperCase(), fmt(add.amount)]);
  }

  // Deductions column: statutory deductions plus any custom deductions.
  const deductionItems: Array<[string, string]> = [
    ['EDTAX', fmt(line.edtaxDeduction)],
    ['NHT', fmt(line.nhtDeduction)],
    ['NIS', fmt(line.nisDeduction)],
    ['PAYE', fmt(line.incomeTax)],
  ];
  for (const ded of line.customDeductions) {
    deductionItems.push([ded.label.toUpperCase(), fmt(ded.amount)]);
  }

  const rowCount = Math.max(incomeItems.length, deductionItems.length);
  const body: RowInput[] = [];
  for (let i = 0; i < rowCount; i++) {
    const income = incomeItems[i] ?? ['', ''];
    const deduction = deductionItems[i] ?? ['', ''];
    body.push([income[0], income[1], deduction[0], deduction[1]]);
  }
  body.push([
    'GROSS PAY',
    { content: fmt(line.grossPay), styles: { fontStyle: 'bold' } },
    { content: 'TOT: DEDUCTIONS', styles: { fontStyle: 'bold' } },
    { content: fmt(line.totalDeductions), styles: { fontStyle: 'bold' } },
  ]);

  autoTable(doc, {
    startY: idY + 20,
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 1.3 },
    headStyles: { fillColor: [241, 245, 249], textColor: 20, fontStyle: 'bold' },
    head: [['INCOME', 'AMOUNT', 'DEDUCTIONS', 'AMOUNT']],
    body,
    columnStyles: { 1: { halign: 'right' }, 3: { halign: 'right' } },
    margin: { left: margin, right: margin },
  });

  const afterTable = lastY(doc);
  doc.setFont('helvetica', 'bold').setFontSize(10);
  doc.text(`NET PAY AMT: ${fmt(line.netPay)}`, pageWidth - margin, afterTable + 6, {
    align: 'right',
  });

  // Year-to-date table
  autoTable(doc, {
    startY: afterTable + 10,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 1.2 },
    headStyles: { fillColor: [241, 245, 249], textColor: 20, fontStyle: 'bold' },
    head: [['Year To Date', 'TAX GROSS', 'EDTAX', 'NHT', 'NIS', 'PAYE']],
    body: [
      [
        '',
        money.format(ytd.taxGross),
        money.format(ytd.edtax),
        money.format(ytd.nht),
        money.format(ytd.nis),
        money.format(ytd.paye),
      ],
    ],
    margin: { left: margin, right: margin },
  });

  return lastY(doc);
}

/**
 * Build a single PDF of every payslip for a run and trigger a download. Payslips
 * are packed onto each page, starting a new page only when the next one won't fit.
 * Returns the number of payslips generated.
 */
export function generatePayslipsPdf(
  company: CompanyDto,
  run: PayrollRunDto,
  lines: PayslipLine[],
): number {
  const document = buildPayslipDocument(company, run, lines);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const topMargin = 14;
  const bottomMargin = 12;

  let y = topMargin;

  document.entries.forEach((entry, index) => {
    // Estimate the block height so a payslip isn't split across pages.
    const rows = Math.max(1 + entry.line.additions.length, 4 + entry.line.customDeductions.length);
    const estimatedHeight = 78 + rows * 7;

    if (y > topMargin && y + estimatedHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = topMargin;
    }

    const endY = renderPayslip(
      doc,
      document.companyName,
      document.periodEnding,
      document.runDate,
      document.cycle,
      entry,
      index,
      y,
    );

    // Divider between payslips on the same page.
    doc.setDrawColor(203, 213, 225);
    doc.line(14, endY + 5, pageWidth - 14, endY + 5);
    y = endY + 12;
  });

  if (document.entries.length === 0) {
    doc.setFontSize(12);
    doc.text('No payslips were recorded for this payroll run.', 14, 20);
  }

  const safeName = document.companyName.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  doc.save(`payslips-${safeName}-cycle-${document.cycle}.pdf`);

  return document.entries.length;
}
