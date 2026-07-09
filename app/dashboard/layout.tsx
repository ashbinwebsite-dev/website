import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import ToastProvider from "@/components/dashboard/ToastProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-[240px]">
        <main className="min-h-screen py-8 px-8 lg:px-10">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </div>
    </div>
  );
}
