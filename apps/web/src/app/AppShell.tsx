import { Outlet } from 'react-router-dom';

import { Header } from '../components';
import { Sidebar } from '../components';

export function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-canvas">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
