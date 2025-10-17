import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ListingsGrid } from "@/components/listings/listings-grid";
import { HeroSearch } from "@/components/home/hero-search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getFeatured() {
  const res = await fetch(`${API_URL}/properties?limit=12`, {
    cache: "no-store",
  });
  if (!res.ok) return { properties: [] };
  return res.json();
}

export default async function HomePage() {
  const { properties } = await getFeatured();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-secondary">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Find unique places to stay around the world
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Explore memorable stays for any occasion.
            </p>
          </div>
          <div className="mt-6">
            <HeroSearch />
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/listings">
              <Button size="lg">Explore stays</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Featured stays</h2>
              <p className="text-sm text-muted-foreground">
                Popular picks among travelers
              </p>
            </div>
            <Link
              href="/listings"
              className="text-sm font-medium text-primary hover:underline"
            >
              See all
            </Link>
          </div>
          <ListingsGrid properties={properties || []} />
        </div>
      </section>
    </main>
  );
}
