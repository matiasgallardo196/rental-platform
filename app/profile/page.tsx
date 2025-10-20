"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/auth/form-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUploader } from "@/components/profile/avatar-uploader";
import { useToast } from "@/hooks/use-toast";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";

export default function ProfilePage() {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.user_metadata?.name || "",
      email: session?.user?.email || "",
      avatar: "",
      bio: "",
      phone: "",
    },
  });

  const avatar = watch("avatar");
  const name = watch("name");

  // Cargar avatar desde profiles
  useState(() => {
    (async () => {
      if (!session?.user) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url, name")
          .eq("id", session.user.id)
          .maybeSingle();
        const dbAvatar = (data as any)?.avatar_url as string | undefined;
        const dbName = (data as any)?.name as string | undefined;
        if (dbAvatar) setValue("avatar", dbAvatar);
        if (dbName) setValue("name", dbName);
      } catch {}
    })();
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo actualizar el perfil");
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se actualizó correctamente.",
      });

      router.refresh();
    } catch (error) {
      console.error("[v0] Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "Por favor, intenta más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de perfil</CardTitle>
          <CardDescription>
            Administra la información de tu cuenta y preferencias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <AvatarUploader
                value={avatar}
                onChange={(url) => setValue("avatar", url)}
                name={name}
              />
            </div>

            <FormInput
              label="Nombre completo"
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

            <FormInput
              label="Número de teléfono"
              type="tel"
              placeholder="+1 (555) 000-0000"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                placeholder="Cuéntanos sobre ti..."
                rows={4}
                className={errors.bio && "border-destructive"}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
