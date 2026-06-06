import { AlertCircle } from 'lucide-react'

import type { TodoTask } from '../data/dashboard'

export function TodoTasks({ tasks }: { tasks: TodoTask[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-ink">To Do Tasks</h3>

      {tasks.length === 0 ? (
        <p className="mt-5 text-sm text-muted">No tasks to show.</p>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {tasks.map(({ id, text }) => (
            <div key={id} className="flex gap-3">
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-sm text-ink">{text}</p>
                <a
                  href="#"
                  className="mt-1 inline-block text-sm font-medium text-brand hover:underline"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
