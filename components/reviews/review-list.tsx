"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { format } from "date-fns"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No reviews yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {review.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{review.user.name}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(review.createdAt), "MMMM yyyy")}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{review.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
