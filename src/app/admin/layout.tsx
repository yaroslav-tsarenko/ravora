import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar/AdminTopbar";
import { Toaster } from "sonner";
import "@/styles/globals.css";
import "@/styles/admin.css";

export const metadata = {
  title: "Admin Panel | My Store",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="admin-layout" data-admin-theme>
          <AdminSidebar />
          <div className="admin-main">
            <AdminTopbar />
            <div className="admin-content">
              {children}
            </div>
          </div>
        </div>
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
