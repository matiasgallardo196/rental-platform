import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
    // Upsert user profile on first login
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (!existing) {
        await supabase.from("profiles").insert({
          id: user.id,
          role: "guest",
          name:
            (user.user_metadata as any)?.name ||
            (user.user_metadata as any)?.full_name ||
            user.email?.split("@")[0] ||
            null,
          avatar_url: (user.user_metadata as any)?.avatar_url || null,
        });
      }

      // Ensure role exists in user_metadata for client-side checks
      const meta = (user.user_metadata as any) || {};
      const update: Record<string, any> = {};
      if (!meta.role) update.role = "guest";
      if (!meta.full_name && meta.name) update.full_name = meta.name;
      if (Object.keys(update).length > 0) {
        await supabase.auth.updateUser({ data: update });
      }
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}

export async function POST(request: Request) {
  return GET(request);
}
