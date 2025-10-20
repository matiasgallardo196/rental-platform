"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckEmailPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <CardTitle>Revisa tu correo</CardTitle>
          <CardDescription>
            Te enviamos un enlace de confirmación para activar tu cuenta. Abre
            tu bandeja de entrada y sigue las instrucciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Si no ves el correo en unos minutos, revisa la carpeta de spam o
            correo no deseado.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => router.push("/login")}>
            Ir a iniciar sesión
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            ¿No recibiste el correo?{" "}
            <span className="font-medium">
              Espera un momento y vuelve a intentarlo
            </span>
            .
          </p>
          <p className="text-center text-xs text-muted-foreground">
            ¿Escribiste mal tu correo?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Volver al registro
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
