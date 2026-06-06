import { Construction } from 'lucide-react';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
        <Construction className="h-7 w-7 text-blue-600" strokeWidth={1.75} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        This section is coming soon. The {title.toLowerCase()} experience is still being built.
      </p>
    </div>
  );
}
