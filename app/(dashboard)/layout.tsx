import React from 'react';

// Por enquanto, um layout simples para o dashboard.
// Mais tarde, você pode adicionar sua Sidebar e Header aqui.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Exemplo: <Sidebar /> */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}