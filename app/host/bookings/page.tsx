"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/admin/data-table";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HostBookingsPage() {
  const { data: session } = useSession();
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [properties, setProperties] = useState<{ id: string; title: string }[]>(
    []
  );
  const [minTotal, setMinTotal] = useState<string>("");
  const [maxTotal, setMaxTotal] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [propertyId, setPropertyId] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!session?.user || (session.user as any).role !== "host") return;
      const hostId = (session.user as any).id;
      const res = await fetch(`${API_URL}/hosts/${hostId}/bookings`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      }
      // Load properties for filter
      const propsRes = await fetch(`${API_URL}/hosts/${hostId}/properties`, {
        cache: "no-store",
      });
      if (propsRes.ok) {
        const pdata = await propsRes.json();
        const opts = (pdata.properties || []).map((p: any) => ({
          id: p.id,
          title: p.title,
        }));
        setProperties(opts);
      }
    };
    load();
  }, [session]);

  if (!session?.user || (session.user as any).role !== "host") {
    return (
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">Not authorized</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/host/listings">Host</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bookings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-4 text-3xl font-bold">Your bookings</h1>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          placeholder="From date"
        />
        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          placeholder="To date"
        />
        <Input
          type="number"
          min={0}
          step={1}
          value={minTotal}
          onChange={(e) => setMinTotal(e.target.value)}
          placeholder="Min total"
        />
        <Input
          type="number"
          min={0}
          step={1}
          value={maxTotal}
          onChange={(e) => setMaxTotal(e.target.value)}
          placeholder="Max total"
        />
        <Select
          value={propertyId}
          onValueChange={(v) => setPropertyId(v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All properties</SelectItem>
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No upcoming bookings</p>
              </CardContent>
            </Card>
          ) : (
            <DataTable
              data={upcoming}
              columns={[
                { key: "id", label: "ID" },
                { key: "propertyId", label: "Property" },
                { key: "checkIn", label: "Check-in" },
                { key: "checkOut", label: "Check-out" },
                { key: "guests", label: "Guests" },
                {
                  key: "total",
                  label: "Total",
                  render: (b: any) => `$${b.total}`,
                },
              ]}
              searchPlaceholder="Search bookings..."
              defaultSortKey="checkIn"
              defaultSortDir="asc"
              filterFn={(b: any) => {
                const min = minTotal ? Number(minTotal) : undefined;
                const max = maxTotal ? Number(maxTotal) : undefined;
                const checkIn = new Date(b.checkIn);
                const from = fromDate ? new Date(fromDate) : undefined;
                const to = toDate ? new Date(toDate) : undefined;
                if (Number.isNaN(min as any) || Number.isNaN(max as any))
                  return true;
                if (min != null && b.total < min) return false;
                if (max != null && b.total > max) return false;
                if (from && checkIn < from) return false;
                if (to && checkIn > to) return false;
                if (propertyId && b.propertyId !== propertyId) return false;
                return true;
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No past bookings
              </CardContent>
            </Card>
          ) : (
            <DataTable
              data={past}
              columns={[
                { key: "id", label: "ID" },
                { key: "propertyId", label: "Property" },
                { key: "checkIn", label: "Check-in" },
                { key: "checkOut", label: "Check-out" },
                { key: "guests", label: "Guests" },
                {
                  key: "total",
                  label: "Total",
                  render: (b: any) => `$${b.total}`,
                },
              ]}
              searchPlaceholder="Search bookings..."
              defaultSortKey="checkIn"
              defaultSortDir="desc"
              filterFn={(b: any) => {
                const min = minTotal ? Number(minTotal) : undefined;
                const max = maxTotal ? Number(maxTotal) : undefined;
                const checkIn = new Date(b.checkIn);
                const from = fromDate ? new Date(fromDate) : undefined;
                const to = toDate ? new Date(toDate) : undefined;
                if (Number.isNaN(min as any) || Number.isNaN(max as any))
                  return true;
                if (min != null && b.total < min) return false;
                if (max != null && b.total > max) return false;
                if (from && checkIn < from) return false;
                if (to && checkIn > to) return false;
                if (propertyId && b.propertyId !== propertyId) return false;
                return true;
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
