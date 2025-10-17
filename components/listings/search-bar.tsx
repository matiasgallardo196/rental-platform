"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get("query") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query) params.set("query", query)
    if (location) params.set("location", location)

    router.push(`/listings?${params.toString()}`)
  }

  return (
    <Card className="p-2">
      <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-input px-3 py-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search properties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0"
          />
        </div>

        <div className="flex flex-1 items-center gap-2 rounded-lg border border-input px-3 py-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-0 p-0 focus-visible:ring-0"
          />
        </div>

        <Button type="submit" size="lg" className="md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
    </Card>
  )
}
