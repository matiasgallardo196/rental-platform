"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openGallery = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
        <div className="relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-l-lg md:aspect-[16/12]">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={`${title} - Main`}
            fill
            className="cursor-pointer object-cover transition-transform hover:scale-105"
            onClick={() => openGallery(0)}
            priority
          />
        </div>

        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative aspect-square overflow-hidden",
              index === 1 && "rounded-tr-lg",
              index === 3 && "rounded-br-lg"
            )}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${title} - ${index + 2}`}
              fill
              className="cursor-pointer object-cover transition-transform hover:scale-105"
              onClick={() => openGallery(index + 1)}
            />
            {index === 3 && images.length > 5 && (
              <button
                onClick={() => openGallery(4)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-colors hover:bg-black/60"
              >
                <span className="text-lg font-semibold">
                  +{images.length - 5} more
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl p-0">
          <div className="relative aspect-video bg-black">
            <Image
              src={images[selectedIndex] || "/placeholder.svg"}
              alt={`${title} - ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
