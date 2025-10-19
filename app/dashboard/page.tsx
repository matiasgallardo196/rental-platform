import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Panel</h1>
      <p className="mt-4 text-muted-foreground">
        ¡Bienvenido de nuevo, {user.user_metadata?.name || user.email}!
      </p>
    </div>
  );
}
