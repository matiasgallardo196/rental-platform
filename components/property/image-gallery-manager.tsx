"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ImageGalleryManagerProps {
  value: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageGalleryManager({ value = [], onChange, maxImages = 10 }: ImageGalleryManagerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    await uploadFiles(files)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await uploadFiles(files)
  }

  const uploadFiles = async (files: File[]) => {
    const remainingSlots = maxImages - value.length
    const filesToUpload = files.slice(0, remainingSlots)

    // TODO: Replace with actual upload to presigned URLs
    const uploadedUrls = await Promise.all(
      filesToUpload.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          }),
      ),
    )

    onChange([...value, ...uploadedUrls])
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const canAddMore = value.length < maxImages

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {value.map((url, index) => (
            <div key={index} className="group relative aspect-video overflow-hidden rounded-lg border border-border">
              <Image
                src={url || "/placeholder.svg"}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white">
                  <GripVertical className="h-4 w-4" />
                  {index === 0 && "Cover photo"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <div
          className={cn(
            "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:bg-muted",
            isDragging && "border-primary bg-primary/10",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">Drag and drop images here, or click to browse</p>
          <p className="text-xs text-muted-foreground">
            {value.length} / {maxImages} images uploaded
          </p>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
    </div>
  )
}
