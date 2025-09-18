import "../globals.css";
import { getCurrentAdmin } from "@/backend/lib/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/app/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  const admin = token ? await getCurrentAdmin({ "admin-token": token }) : null;

  if (!admin) {
    redirect("/login");
  }

  return (
    <html lang="es">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-white">
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
              Panel de Administración
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span className="text-sm md:text-base text-center sm:text-left">
                Hola, {admin.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
