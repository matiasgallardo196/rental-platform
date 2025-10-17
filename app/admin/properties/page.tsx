"use client"

import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface Property {
  id: string
  name: string
  location: string
  host: string
  price: number
  status: "active" | "paused" | "pending"
  bookings: number
}

const mockProperties: Property[] = [
  {
    id: "1",
    name: "Modern Downtown Loft",
    location: "New York, NY",
    host: "John Doe",
    price: 150,
    status: "active",
    bookings: 45,
  },
  {
    id: "2",
    name: "Cozy Beach House",
    location: "Miami, FL",
    host: "Jane Smith",
    price: 200,
    status: "active",
    bookings: 32,
  },
  {
    id: "3",
    name: "Mountain Cabin",
    location: "Denver, CO",
    host: "Bob Johnson",
    price: 120,
    status: "paused",
    bookings: 18,
  },
]

export default function AdminPropertiesPage() {
  const columns = [
    {
      key: "name",
      label: "Propiedad",
      render: (property: Property) => (
        <div>
          <p className="font-medium">{property.name}</p>
          <p className="text-sm text-muted-foreground">{property.location}</p>
        </div>
      ),
    },
    {
      key: "host",
      label: "Anfitrión",
    },
    {
      key: "price",
      label: "Precio",
      render: (property: Property) => `$${property.price}/ noche`,
    },
    {
      key: "bookings",
      label: "Reservas",
    },
    {
      key: "status",
      label: "Estado",
      render: (property: Property) => (
        <Badge
          variant={property.status === "active" ? "default" : property.status === "paused" ? "secondary" : "outline"}
          className="capitalize"
        >
          {property.status === "active" ? "Activa" : property.status === "paused" ? "Pausada" : "Pendiente"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Propiedades</h1>
          <p className="text-muted-foreground">Administra todas las propiedades</p>
        </div>
      </div>

      <DataTable data={mockProperties} columns={columns} searchPlaceholder="Buscar propiedades..." />
    </div>
  )
}
