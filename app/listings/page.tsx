import { Suspense } from "react";
import { SearchBar } from "@/components/listings/search-bar";
import { FiltersSheet } from "@/components/listings/filters-sheet";
import { ListingsGrid } from "@/components/listings/listings-grid";
import { Pagination } from "@/components/listings/pagination";
import { searchParamsSchema } from "@/lib/validations/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Datos vendrán del backend mock

async function getListings(searchParams: any) {
  // Validate search params
  const params = searchParamsSchema.parse(searchParams);

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
  });

  const res = await fetch(`${API_URL}/properties?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load properties");
  return res.json();
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const resolvedParams = await searchParams;
  const { properties, pagination } = await getListings(resolvedParams);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Find your perfect stay</h1>
          <p className="text-muted-foreground">
            Discover unique properties around the world
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {pagination.totalResults} properties available
            </p>
            <FiltersSheet />
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ListingsGrid properties={properties} />
        </Suspense>

        <div className="mt-8">
          <Pagination {...pagination} />
        </div>
      </div>
    </div>
  );
}
