"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { CheckCircle, Circle } from "lucide-react";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una minúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password") || "";
  const confirm = watch("confirm") || "";
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const match = confirm.length > 0 && confirm === password;
  const canSubmit =
    rules.length &&
    rules.upper &&
    rules.lower &&
    rules.number &&
    rules.symbol &&
    match;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) throw error;
      toast({ title: "Contraseña actualizada" });
      router.push("/login");
    } catch (e: any) {
      const status = e?.status;
      const message = e?.message as string | undefined;
      if (
        status === 422 ||
        message?.toLowerCase().includes("same") ||
        message?.toLowerCase().includes("different")
      ) {
        toast({
          variant: "destructive",
          title: "Contraseña inválida",
          description: "La nueva contraseña debe ser distinta a la anterior.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: message || "No se pudo actualizar",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthCard
        title="Restablecer contraseña"
        description="Ingresa tu nueva contraseña"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            label="Nueva contraseña"
            placeholder="Ingresa tu nueva contraseña"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="space-y-1 rounded-md border p-3 text-sm">
            <div className="font-medium">La contraseña debe contener:</div>
            <PasswordRule ok={rules.length} label="Al menos 8 caracteres" />
            <PasswordRule ok={rules.upper} label="Una letra mayúscula (A-Z)" />
            <PasswordRule ok={rules.lower} label="Una letra minúscula (a-z)" />
            <PasswordRule ok={rules.number} label="Un número (0-9)" />
            <PasswordRule ok={rules.symbol} label="Un símbolo (!@#$… )" />
          </div>
          <PasswordInput
            label="Confirmar contraseña"
            placeholder="Confirma tu nueva contraseña"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
          <div className="rounded-md border p-3 text-sm">
            <PasswordRule ok={match} label="Las contraseñas deben coincidir" />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
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
