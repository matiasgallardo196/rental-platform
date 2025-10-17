"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FormInput } from "@/components/auth/form-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageGalleryManager } from "./image-gallery-manager";
import { AmenitySelector } from "./amenity-selector";
import { useToast } from "@/hooks/use-toast";
import {
  propertySchema,
  type PropertyFormData,
  PROPERTY_TYPES,
} from "@/lib/validations/property";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Información básica",
    description: "Detalles de la propiedad",
  },
  { id: 2, title: "Ubicación", description: "¿Dónde está?" },
  { id: 3, title: "Comodidades", description: "¿Qué ofreces?" },
  { id: 4, title: "Capacidad", description: "¿Cuántos huéspedes?" },
  { id: 5, title: "Fotos", description: "Muestra tu espacio" },
  { id: 6, title: "Precios", description: "Define tus tarifas" },
];

export function PropertyFormWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      amenities: [],
      images: [],
      capacity: {
        guests: 1,
        bedrooms: 0,
        beds: 1,
        bathrooms: 1,
      },
      pricing: {
        basePrice: 0,
        cleaningFee: 0,
        taxRate: 0,
      },
    },
  });

  const amenities = watch("amenities");
  const images = watch("images");
  const propertyType = watch("propertyType");

  const progress = (currentStep / STEPS.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["title", "description", "propertyType"];
      case 2:
        return ["location"];
      case 3:
        return ["amenities"];
      case 4:
        return ["capacity"];
      case 5:
        return ["images"];
      case 6:
        return ["pricing"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("No se pudo crear la propiedad");
      }

      toast({
        title: "Propiedad creada",
        description: "Tu propiedad se publicó correctamente.",
      });

      router.push("/host/listings");
    } catch (error) {
      console.error("[v0] Property creation error:", error);
      toast({
        variant: "destructive",
        title: "Error al crear",
        description: "Por favor, intenta más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Publica tu propiedad</h1>
        <p className="mt-2 text-muted-foreground">
          Paso {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].title}
        </p>
        <Progress value={progress} className="mt-4" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {STEPS[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Paso 1: Información básica */}
            {currentStep === 1 && (
              <>
                <FormInput
                  label="Título de la propiedad"
                  placeholder="Hermoso departamento en el centro"
                  error={errors.title?.message}
                  {...register("title")}
                />

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu propiedad..."
                    rows={6}
                    className={errors.description && "border-destructive"}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Tipo de propiedad</Label>
                  <Select
                    value={propertyType}
                    onValueChange={(value) =>
                      setValue("propertyType", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo de propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propertyType && (
                    <p className="text-sm text-destructive">
                      {errors.propertyType.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Paso 2: Ubicación */}
            {currentStep === 2 && (
              <>
                <FormInput
                  label="Dirección"
                  placeholder="Calle 123"
                  error={errors.location?.address?.message}
                  {...register("location.address")}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormInput
                    label="Ciudad"
                    placeholder="San Francisco"
                    error={errors.location?.city?.message}
                    {...register("location.city")}
                  />

                  <FormInput
                    label="Estado/Provincia"
                    placeholder="CA"
                    error={errors.location?.state?.message}
                    {...register("location.state")}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormInput
                    label="País"
                    placeholder="Estados Unidos"
                    error={errors.location?.country?.message}
                    {...register("location.country")}
                  />

                  <FormInput
                    label="Código postal"
                    placeholder="94102"
                    error={errors.location?.zipCode?.message}
                    {...register("location.zipCode")}
                  />
                </div>
              </>
            )}

            {/* Paso 3: Comodidades */}
            {currentStep === 3 && (
              <div className="space-y-2">
                <Label>Selecciona comodidades</Label>
                <AmenitySelector
                  value={amenities}
                  onChange={(value) => setValue("amenities", value)}
                />
                {errors.amenities && (
                  <p className="text-sm text-destructive">
                    {errors.amenities.message}
                  </p>
                )}
              </div>
            )}

            {/* Paso 4: Capacidad */}
            {currentStep === 4 && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Huéspedes"
                  type="number"
                  min="1"
                  error={errors.capacity?.guests?.message}
                  {...register("capacity.guests", { valueAsNumber: true })}
                />

                <FormInput
                  label="Dormitorios"
                  type="number"
                  min="0"
                  error={errors.capacity?.bedrooms?.message}
                  {...register("capacity.bedrooms", { valueAsNumber: true })}
                />

                <FormInput
                  label="Camas"
                  type="number"
                  min="1"
                  error={errors.capacity?.beds?.message}
                  {...register("capacity.beds", { valueAsNumber: true })}
                />

                <FormInput
                  label="Baños"
                  type="number"
                  min="1"
                  step="0.5"
                  error={errors.capacity?.bathrooms?.message}
                  {...register("capacity.bathrooms", { valueAsNumber: true })}
                />
              </div>
            )}

            {/* Paso 5: Fotos */}
            {currentStep === 5 && (
              <div className="space-y-2">
                <Label>Fotos de la propiedad</Label>
                <ImageGalleryManager
                  value={images}
                  onChange={(value) => setValue("images", value)}
                />
                {errors.images && (
                  <p className="text-sm text-destructive">
                    {errors.images.message}
                  </p>
                )}
              </div>
            )}

            {/* Paso 6: Precios */}
            {currentStep === 6 && (
              <>
                <FormInput
                  label="Precio base por noche"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="100.00"
                  error={errors.pricing?.basePrice?.message}
                  {...register("pricing.basePrice", { valueAsNumber: true })}
                />

                <FormInput
                  label="Tarifa de limpieza (opcional)"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                  error={errors.pricing?.cleaningFee?.message}
                  {...register("pricing.cleaningFee", { valueAsNumber: true })}
                />

                <FormInput
                  label="Impuesto % (opcional)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="10.00"
                  error={errors.pricing?.taxRate?.message}
                  {...register("pricing.taxRate", { valueAsNumber: true })}
                />
              </>
            )}

            {/* Navegación */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={nextStep}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creando..." : "Publicar propiedad"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
