import { useState } from 'react';

export function EmailTemplatesTab() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Email Templates</h2>
      <p className="mt-1 text-sm text-muted">Customize email templates for payroll communications</p>

      <div className="mt-6">
        <label className="block text-sm font-medium text-ink" htmlFor="payslip-subject">
          Payslip Email Subject
        </label>
        <input
          id="payslip-subject"
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-ink" htmlFor="email-body">
          Email Body
        </label>
        <textarea
          id="email-body"
          rows={8}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <p className="mt-3 text-sm text-muted">
        Available variables: {'{employee_name}'}, {'{period}'}, {'{net_pay}'}, {'{gross_pay}'}
      </p>
    </div>
  );
}
