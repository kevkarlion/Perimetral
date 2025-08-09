import "../globals.css";
import { getCurrentAdmin } from "@/backend/lib/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/app/components/LogoutButton"; // Componente optimizado

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // 👈 Esperamos la Promise
  const token = cookieStore.get("admin-token")?.value;

  const admin = token ? await getCurrentAdmin({ "admin-token": token }) : null;

  if (!admin) {
    redirect("/login");
  }

  return (
    <html lang="es">
      <body className="min-h-screen bg-white">
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Panel de Administración</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">Hola, {admin.email}</span>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
