import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2, Wallet } from 'lucide-react';

import { useAuthStore } from '../store/auth-store';

const FEATURES = [
  {
    title: 'Automated Tax Calculations',
    description: 'Handle federal and local tax deductions with precision',
  },
  {
    title: 'Seamless Payroll Processing',
    description: 'Pay employees directly with secure and reliable transfers',
  },
  {
    title: 'Compliance & Reporting',
    description: 'Generate tax forms and reports instantly to stay compliant',
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [email, setEmail] = useState('admin@zylker.com');
  const [password, setPassword] = useState('demo1234');

  if (isAuthenticated) {
    return <Navigate to="/select-company" replace />;
  }

  const canSubmit = email.trim().length > 0 && password.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    login(email.trim());
    void navigate('/select-company', { replace: true });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden flex-col justify-center bg-navy px-10 py-12 text-white lg:flex xl:px-16">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Wallet className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-2xl font-bold leading-none">Payroll</p>
            <p className="mt-1 text-sm text-slate-400">Simplify payroll. Automate compliance.</p>
          </div>
        </div>

        <h1 className="mt-14 max-w-md text-5xl font-bold leading-tight">
          Payroll Management Platform
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
          A centralized payroll engine that automates salary calculations, statutory deductions, and
          compliance outputs—turning messy spreadsheets into clean, compliant payroll packages in
          minutes.
        </p>

        <ul className="mt-12 flex flex-col gap-7">
          {FEATURES.map(({ title, description }) => (
            <li key={title} className="flex items-start gap-4">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-slate-300" strokeWidth={1.75} />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-slate-400">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center bg-canvas px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-3xl font-bold text-ink">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted">Demo: admin@zylker.com / any password</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <label className="block text-sm font-medium text-ink" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />

            <label className="mt-5 block text-sm font-medium text-ink" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign In
            </button>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Or continue with
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex flex-col gap-3">
              <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
              <SocialButton icon={<MicrosoftIcon />} label="Continue with Microsoft" />
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            By signing in, you agree to our{' '}
            <a href="#" className="font-medium text-brand hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-brand hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-slate-50"
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}
