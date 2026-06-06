import { useHealthCheck } from '../hooks/useHealthCheck';
import { useAppStore } from '../store/app-store';

export function HomePage() {
  const { data, isLoading, isError } = useHealthCheck();
  const lastHealthCheckAt = useAppStore((state) => state.lastHealthCheckAt);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <article className="rounded-4xl border border-white/10 bg-white/6 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Router Shell</p>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white">
          A minimal React 19 shell with routing, query state, and workspace-ready styling.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          This page is intentionally small. It exists to prove the workspace wiring without introducing any
          product features or domain-specific UI.
        </p>
      </article>

      <aside className="rounded-4xl border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Health Check</p>
        <div className="mt-6 space-y-4 text-sm text-slate-200">
          <StatusRow label="Loading" value={isLoading ? 'yes' : 'no'} />
          <StatusRow label="Error" value={isError ? 'yes' : 'no'} />
          <StatusRow label="Status" value={data?.status ?? 'pending'} />
          <StatusRow label="Service" value={data?.service ?? 'api'} />
          <StatusRow label="Last synced" value={lastHealthCheckAt ?? 'waiting'} />
        </div>
      </aside>
    </section>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
