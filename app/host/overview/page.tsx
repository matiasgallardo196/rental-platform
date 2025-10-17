"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HostOverviewPage() {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!session?.user || (session.user as any).role !== "host") return;
      const hostId = (session.user as any).id;
      const res = await fetch(`${API_URL}/hosts/${hostId}/overview`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || null);
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
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-6 text-3xl font-bold">Host overview</h1>

      {!summary ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Loading...
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {summary.properties}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {summary.bookings}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total nights</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {summary.totalNights}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              ${summary.revenue}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg rating</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {summary.averageRating}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {summary.reviewCount}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              ${summary.available}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              ${summary.pending}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

