import type { CompanyDto, CompanyMemberDto } from '@starter/types';
import {
  companies,
  companyMembers,
  employees,
  type Company,
  type CompanyMember,
  type CreateCompanyInput,
} from '@starter/db';
import { and, asc, count, eq } from 'drizzle-orm';

import type { Database } from '../lib/db';

function toMemberDto(member: CompanyMember): CompanyMemberDto {
  return {
    id: member.id,
    companyId: member.companyId,
    fullName: member.fullName,
    email: member.email,
    role: member.role,
    createdAt: member.createdAt.toISOString(),
  };
}

function toCompanyDto(
  company: Company,
  members?: CompanyMember[],
  activeEmployeeCount = 0,
): CompanyDto {
  return {
    id: company.id,
    name: company.name,
    industry: company.industry,
    employeeCount: company.employeeCount,
    activeEmployeeCount,
    address: company.address,
    trn: company.trn,
    nis: company.nis,
    email: company.email,
    logoUrl: company.logoUrl,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
    members: members?.map(toMemberDto),
  };
}

export async function listCompanies(db: Database): Promise<CompanyDto[]> {
  const rows = await db.select().from(companies).orderBy(asc(companies.createdAt));

  const counts = await db
    .select({ companyId: employees.companyId, value: count() })
    .from(employees)
    .where(eq(employees.status, 'Active'))
    .groupBy(employees.companyId);

  const activeByCompany = new Map(counts.map((row) => [row.companyId, Number(row.value)]));

  return rows.map((row) => toCompanyDto(row, undefined, activeByCompany.get(row.id) ?? 0));
}

export async function getCompany(db: Database, id: string): Promise<CompanyDto | null> {
  const [company] = await db.select().from(companies).where(eq(companies.id, id)).limit(1);

  if (!company) {
    return null;
  }

  const members = await db
    .select()
    .from(companyMembers)
    .where(eq(companyMembers.companyId, id))
    .orderBy(asc(companyMembers.createdAt));

  const [activeCount] = await db
    .select({ value: count() })
    .from(employees)
    .where(and(eq(employees.companyId, id), eq(employees.status, 'Active')));

  return toCompanyDto(company, members, Number(activeCount?.value ?? 0));
}

export async function createCompany(
  db: Database,
  input: CreateCompanyInput,
): Promise<CompanyDto> {
  return db.transaction(async (tx) => {
    const [company] = await tx
      .insert(companies)
      .values({
        name: input.name,
        industry: input.industry,
        employeeCount: input.employeeCount,
        address: input.address,
        trn: input.trn,
        nis: input.nis,
        email: input.email,
        logoUrl: input.logoUrl ? input.logoUrl : null,
      })
      .returning();

    if (!company) {
      throw new Error('Failed to create company');
    }

    let members: CompanyMember[] = [];

    if (input.members.length > 0) {
      members = await tx
        .insert(companyMembers)
        .values(
          input.members.map((member) => ({
            companyId: company.id,
            fullName: member.fullName,
            email: member.email,
            role: member.role,
          })),
        )
        .returning();
    }

    return toCompanyDto(company, members);
  });
}
