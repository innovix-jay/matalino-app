'use client';

import { useState } from 'react';
import { Search, Heart, Download, Trash2, RefreshCw, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useImages,
  useToggleFavorite,
  useDeleteImage,
  useCreateVariation,
} from '@/lib/hooks/use-ai-images';
import { GeneratedImage, ImageStyleType } from '@/types/ai';
import { ModelIndicator } from './model-indicator';
import { Loader2 } from 'lucide-react';

interface AIImageGalleryProps {
  onSelectImage?: (image: GeneratedImage) => void;
  selectable?: boolean;
}

export function AIImageGallery({ onSelectImage, selectable = false }: AIImageGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: images, isLoading } = useImages({
    query: searchQuery || undefined,
    modelId: filterModel !== 'all' ? filterModel : undefined,
    style: filterStyle !== 'all' ? filterStyle : undefined,
    isFavorite: showFavoritesOnly || undefined,
  });

  const { toggleFavorite } = useToggleFavorite();
  const deleteMutation = useDeleteImage();
  const createVariationMutation = useCreateVariation();

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    if (selectable && onSelectImage) {
      onSelectImage(image);
    } else {
      setDetailDialogOpen(true);
    }
  };

  const handleDownload = async (image: GeneratedImage) => {
    const response = await fetch(image.image_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.id}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDelete = async (imageId: string) => {
    if (confirm('Delete this image? This cannot be undone.')) {
      await deleteMutation.mutateAsync(imageId);
      if (selectedImage?.id === imageId) {
        setDetailDialogOpen(false);
        setSelectedImage(null);
      }
    }
  };

  const handleCreateVariation = async (imageId: string) => {
    await createVariationMutation.mutateAsync(imageId);
    setDetailDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Model Filter */}
        <Select value={filterModel} onValueChange={setFilterModel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Models" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            <SelectItem value="dalle3">DALL-E 3</SelectItem>
            <SelectItem value="sdxl">SDXL</SelectItem>
            <SelectItem value="gemini-nano-banana">Gemini Nano</SelectItem>
            <SelectItem value="midjourney">Midjourney</SelectItem>
          </SelectContent>
        </Select>

        {/* Style Filter */}
        <Select value={filterStyle} onValueChange={setFilterStyle}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Styles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Styles</SelectItem>
            <SelectItem value="photorealistic">Photorealistic</SelectItem>
            <SelectItem value="artistic">Artistic</SelectItem>
            <SelectItem value="abstract">Abstract</SelectItem>
            <SelectItem value="illustration">Illustration</SelectItem>
            <SelectItem value="sketch">Sketch</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
          </SelectContent>
        </Select>

        {/* Favorites Toggle */}
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="icon"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : images && images.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg font-medium text-muted-foreground mb-2">No images found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery || filterModel !== 'all' || filterStyle !== 'all' || showFavoritesOnly
              ? 'Try adjusting your filters'
              : 'Generate your first AI image to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((image) => (
            <Card
              key={image.id}
              className="group cursor-pointer hover:ring-2 hover:ring-primary transition-all overflow-hidden"
              onClick={() => handleImageClick(image)}
            >
              <CardContent className="p-0 relative">
                <img
                  src={image.thumbnail_url || image.image_url}
                  alt={image.prompt.slice(0, 50)}
                  className="w-full aspect-square object-cover"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(image.id, image.is_favorite);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        image.is_favorite ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                </div>

                {/* Favorite Badge */}
                {image.is_favorite && (
                  <div className="absolute top-2 right-2">
                    <Heart className="h-5 w-5 fill-red-500 text-red-500 drop-shadow-lg" />
                  </div>
                )}

                {/* Model Badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {image.model_id}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      {selectedImage && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  className="w-full rounded-lg"
                />
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Prompt:</p>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                  {selectedImage.prompt}
                </p>
              </div>

              {/* Negative Prompt */}
              {selectedImage.negative_prompt && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Negative Prompt:</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {selectedImage.negative_prompt}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Style</p>
                  <p className="text-sm font-medium capitalize">{selectedImage.style}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="text-sm font-medium">{selectedImage.size}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality</p>
                  <p className="text-sm font-medium capitalize">{selectedImage.quality}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Generation Time</p>
                  <p className="text-sm font-medium">
                    {(selectedImage.generation_time_ms / 1000).toFixed(1)}s
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Model Info */}
              {selectedImage.model_id && (
                <div className="p-4 bg-muted rounded-lg">
                  <ModelIndicator
                    model={selectedImage.model_id as any}
                    cost={selectedImage.cost_cents / 100}
                    reasoning={selectedImage.routing_decision?.reasoning}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDownload(selectedImage)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleFavorite(selectedImage.id, selectedImage.is_favorite)}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      selectedImage.is_favorite ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  {selectedImage.is_favorite ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCreateVariation(selectedImage.id)}
                  disabled={createVariationMutation.isPending}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Create Variation
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedImage.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
