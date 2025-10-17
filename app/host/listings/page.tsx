"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HostListingsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user || (session.user as any).role !== "host") return;
      const hostId = (session.user as any).id;
      const res = await fetch(`${API_URL}/hosts/${hostId}/properties`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.properties || []);
      }
    };
    load();
  }, [session]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your listings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your properties and reservations
          </p>
        </div>
        <Link href="/host/listings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add listing
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-lg border p-4">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-muted-foreground">{p.location}</div>
            <div className="mt-2 text-sm">${p.pricing.basePrice} / night</div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-muted-foreground w-full">
            No listings yet. Create your first property listing to get started.
          </p>
        )}
      </div>
    </div>
  );
}
