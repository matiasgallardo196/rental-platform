import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Panel</h1>
      <p className="mt-4 text-muted-foreground">
        ¡Bienvenido de nuevo, {session.user?.name || session.user?.email}!
      </p>
    </div>
  );
}
