"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookingsPage() {
  const { data: session } = useSession();
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return;
      const userId = (session.user as any).id;
      try {
        const res = await fetch(
          `${API_URL}/bookings?userId=${encodeURIComponent(userId)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          setUpcoming(data.upcoming || []);
          setPast(data.past || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [session]);
  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Mis reservas</h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="past">Pasadas</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {upcoming.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">
                    No tienes reservas próximas
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Comienza a planear tu próximo viaje
                  </p>
                  <Button asChild>
                    <Link href="/listings">Ver propiedades</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcoming.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-40 md:w-60">
                        <Image
                          src={booking.property.image || "/placeholder.svg"}
                          alt={booking.property.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {booking.property.name}
                              </h3>
                              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {booking.property.location}
                              </div>
                            </div>
                            <Badge variant="secondary">{booking.status}</Badge>
                          </div>

                          <div className="mt-4 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {booking.checkIn} - {booking.checkOut}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {booking.guests} huéspedes
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total pagado
                            </p>
                            <p className="text-xl font-semibold">
                              ${booking.total}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Mensaje al anfitrión
                            </Button>
                            <Button variant="outline" size="sm">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6 space-y-4">
            {past.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-40 md:w-60">
                      <Image
                        src={booking.property.image || "/placeholder.svg"}
                        alt={booking.property.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {booking.property.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {booking.property.location}
                            </div>
                          </div>
                          <Badge variant="outline">{booking.status}</Badge>
                        </div>

                        <div className="mt-4 space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {booking.checkIn} - {booking.checkOut}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total pagado
                          </p>
                          <p className="text-xl font-semibold">
                            ${booking.total}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!booking.hasReview && (
                            <Button size="sm">
                              <Star className="mr-2 h-4 w-4" />
                              Dejar reseña
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
