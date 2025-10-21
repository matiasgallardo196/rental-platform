import { Suspense } from "react";
import { SearchBar } from "@/components/listings/search-bar";
import { FiltersSheet } from "@/components/listings/filters-sheet";
import { ListingsGrid } from "@/components/listings/listings-grid";
import { Pagination } from "@/components/listings/pagination";
import { searchParamsSchema } from "@/lib/validations/search";
import { getJson } from "@/lib/api";

// Datos vendrán del backend mock

async function getListings(searchParams: any) {
  // Validate search params
  const params = searchParamsSchema.parse(searchParams);

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
  });

  return await getJson<{ properties: any[]; pagination: any }>(
    `/properties?${qs.toString()}`,
    { properties: [], pagination: { totalResults: 0, page: 1, pageSize: 0 } }
  );
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
          <h1 className="mb-2 text-3xl font-bold">
            Encuentra tu estadía perfecta
          </h1>
          <p className="text-muted-foreground">
            Descubre propiedades únicas alrededor del mundo
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {pagination.totalResults} propiedades disponibles
            </p>
            <FiltersSheet />
          </div>
        </div>

        <Suspense fallback={<div>Cargando...</div>}>
          <ListingsGrid properties={properties} />
        </Suspense>

        <div className="mt-8">
          <Pagination {...pagination} />
        </div>
      </div>
    </div>
  );
}
