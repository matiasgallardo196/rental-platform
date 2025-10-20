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
      // Datos provenientes del proveedor (Google: picture)
      const meta = (user.user_metadata as any) || {};
      const nameFromMeta = meta.name || meta.full_name;
      const pictureFromMeta = meta.avatar_url || meta.picture || null;

      // Upsert del perfil: crea si no existe, actualiza avatar/nombre si vienen del proveedor
      const { data: existing } = await supabase
        .from("profiles")
        .select("id, avatar_url, name")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("profiles").insert({
          id: user.id,
          role: "guest",
          name: nameFromMeta || user.email?.split("@")[0] || null,
          avatar_url: pictureFromMeta,
        });
      } else {
        // Si no teníamos avatar o nombre, completa con los del proveedor
        const patch: Record<string, any> = {};
        if (!existing.avatar_url && pictureFromMeta)
          patch.avatar_url = pictureFromMeta;
        if (!existing.name && (nameFromMeta || user.email))
          patch.name = nameFromMeta || user.email?.split("@")[0] || null;
        if (Object.keys(patch).length > 0) {
          await supabase.from("profiles").update(patch).eq("id", user.id);
        }
      }

      // Ensure role exists in user_metadata for client-side checks
      const update: Record<string, any> = {};
      if (!meta.role) update.role = "guest";
      if (!meta.full_name && meta.name) update.full_name = meta.name;
      if (!meta.avatar_url && meta.picture) update.avatar_url = meta.picture;
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
