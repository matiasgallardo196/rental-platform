"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { FormInput } from "@/components/auth/form-input";
import { PasswordInput } from "@/components/auth/password-input";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Divider } from "@/components/auth/divider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { CheckCircle, Circle } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Por favor ingresa un correo válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una minúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas deben coincidir",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const pwd = watch("password") || "";
  const pwd2 = watch("confirmPassword") || "";
  const pwdRules = {
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    symbol: /[^A-Za-z0-9]/.test(pwd),
  };
  const matchRule = pwd2.length > 0 && pwd2 === pwd;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowser();
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        data.name
      )}`;
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: origin
            ? `${origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`
            : undefined,
          data: {
            // Supabase muestra "Display name" a partir de user_metadata.full_name
            full_name: data.name,
            name: data.name,
            role: "guest",
            iss: "email",
            avatar_url: avatarUrl,
            picture: avatarUrl,
          },
        },
      });
      if (error) throw error;

      // Si la sesión queda abierta tras el sign up (confirmación desactivada),
      // crea el perfil inmediatamente con RLS.
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
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
                name: data.name,
                avatar_url: avatarUrl,
              });
            }
          }
        }
      } catch (_) {
        // noop: si no hay sesión (requiere confirmación), se creará al iniciar sesión
      }

      toast({
        title: "Cuenta creada",
        description: "Revisa tu correo para confirmar la cuenta.",
      });

      router.push("/check-email");
    } catch (error) {
      console.error("[v0] Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registro fallido",
        description:
          error instanceof Error
            ? error.message
            : "Por favor, intenta más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title="Crea una cuenta"
        description="Comienza tu experiencia de alquiler"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Nombre completo"
            type="text"
            placeholder="Juan Pérez"
            error={errors.name?.message}
            {...register("name")}
          />

          <FormInput
            label="Correo"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Crea una contraseña"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="space-y-1 rounded-md border p-3 text-sm">
            <div className="font-medium">La contraseña debe contener:</div>
            <PasswordRule ok={pwdRules.length} label="Al menos 8 caracteres" />
            <PasswordRule
              ok={pwdRules.upper}
              label="Una letra mayúscula (A-Z)"
            />
            <PasswordRule
              ok={pwdRules.lower}
              label="Una letra minúscula (a-z)"
            />
            <PasswordRule ok={pwdRules.number} label="Un número (0-9)" />
            <PasswordRule ok={pwdRules.symbol} label="Un símbolo (!@#$… )" />
          </div>

          <PasswordInput
            label="Confirmar contraseña"
            placeholder="Confirma tu contraseña"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <div className="rounded-md border p-3 text-sm">
            <PasswordRule
              ok={matchRule}
              label="Las contraseñas deben coincidir"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <Divider />

        <OAuthButtons />

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={
        ok
          ? "text-emerald-600 flex items-center gap-2"
          : "text-muted-foreground flex items-center gap-2"
      }
    >
      {ok ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      <span>{label}</span>
    </div>
  );
}
