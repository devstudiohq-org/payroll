// The tax calculation lives in @starter/types so the API and web share one
// implementation. Re-exported here for existing import sites.
export { computeDeductions, buildPayslipLine, type Deductions } from '@starter/types';
