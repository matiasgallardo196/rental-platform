"use client";

import Link from "next/link";
import { getJson } from "@/lib/api";
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NEXT_PUBLIC_API_URL as API_URL } from "@/lib/env.loader";

export default function HostListingsPage() {
  const session = useSession();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user || session.user.user_metadata?.role !== "host") return;
      const hostId = session.user.id;
      const data = await getJson<{ properties: any[] }>(
        `/hosts/${hostId}/properties`,
        { properties: [] }
      );
      setItems(data.properties || []);
    };
    load();
  }, [session]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tus publicaciones</h1>
          <p className="mt-2 text-muted-foreground">
            Administra tus propiedades y reservas
          </p>
        </div>
        <Link href="/host/listings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar publicación
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-lg border p-4">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-muted-foreground">{p.location}</div>
            <div className="mt-2 text-sm">${p.pricing.basePrice} / noche</div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-muted-foreground w-full">
            Aún no tienes publicaciones. Crea tu primera propiedad para
            comenzar.
          </p>
        )}
      </div>
    </div>
  );
}
