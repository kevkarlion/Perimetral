import "../globals.css";
import { getCurrentAdmin } from "@/backend/lib/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  const admin = token ? await getCurrentAdmin({ "admin-token": token }) : null;

  if (!admin) redirect("/login");

  return (
    <html lang="es">
      <body className="bg-[#0b0b0d] text-white min-h-screen p-0">
        {children}
      </body>
    </html>
  );
}
