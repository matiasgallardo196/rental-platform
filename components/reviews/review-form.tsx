"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReviewFormData, reviewSchema } from "@/lib/validations/review";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  propertyId: string;
  bookingId: string;
  onSuccess?: () => void;
}

const categories = [
  { key: "cleanliness", label: "Limpieza" },
  { key: "accuracy", label: "Exactitud" },
  { key: "communication", label: "Comunicación" },
  { key: "location", label: "Ubicación" },
  { key: "value", label: "Valor" },
];

export function ReviewForm({
  propertyId,
  bookingId,
  onSuccess,
}: ReviewFormProps) {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, number>>({
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    value: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      propertyId,
      bookingId,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      // Calculate overall rating as average
      const overallRating = Math.round(
        (data.cleanliness +
          data.accuracy +
          data.communication +
          data.location +
          data.value) /
          5
      );

      // In a real app, send to API
      console.log({ ...data, rating: overallRating });

      toast({
        title: "Reseña enviada",
        description: "¡Gracias por tu comentario!",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  };

  const setRating = (category: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [category]: rating }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dejar una reseña</CardTitle>
        <CardDescription>
          Comparte tu experiencia para ayudar a otros huéspedes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.key} className="space-y-2">
                <Label>{category.label}</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(category.key, star)}
                      className="transition-colors hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (ratings[category.key] || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register(category.key as keyof ReviewFormData, {
                    valueAsNumber: true,
                  })}
                  value={ratings[category.key]}
                />
                {errors[category.key as keyof ReviewFormData] && (
                  <p className="text-sm text-destructive">
                    {errors[category.key as keyof ReviewFormData]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Tu reseña</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder="Comparte detalles sobre tu estadía..."
              rows={5}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enviando..." : "Enviar reseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
