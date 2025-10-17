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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HostBalancesPage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!session?.user || (session.user as any).role !== "host") return;
      const hostId = (session.user as any).id;
      const res = await fetch(`${API_URL}/hosts/${hostId}/balances`, {
        cache: "no-store",
      });
      if (res.ok) setBalance(await res.json());
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
              <BreadcrumbPage>Balances</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-4 text-3xl font-bold">Your balance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div>Available: ${balance?.available ?? 0}</div>
          <div>Pending: ${balance?.pending ?? 0}</div>
          {balance?.lastPayoutAt && (
            <div>Last payout: {balance.lastPayoutAt}</div>
          )}
        </CardContent>
      </Card>

      {Array.isArray(balance?.recent) && balance?.recent.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balance.recent.map((r: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.type}</TableCell>
                        <TableCell className="text-right">
                          ${r.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
