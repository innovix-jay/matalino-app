'use client';

import { useState } from 'react';
import { Wand2, Loader2, Sparkles, Download, Heart, Copy, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGenerateImage, useCreateVariation, useToggleFavorite, useDeleteImage } from '@/lib/hooks/use-ai-images';
import { GeneratedImage, ImageStyleType } from '@/types/ai';
import { ModelIndicator } from './model-indicator';
import { imageRoutingEngine } from '@/lib/ai/image-routing-engine';

interface AIImageGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void;
  initialPrompt?: string;
  showGallery?: boolean;
}

export function AIImageGenerator({
  onImageGenerated,
  initialPrompt = '',
  showGallery = true,
}: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState<ImageStyleType>('photorealistic');
  const [size, setSize] = useState<'1024x1024' | '1024x1792' | '1792x1024'>('1024x1024');
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const generateMutation = useGenerateImage();
  const createVariationMutation = useCreateVariation();
  const { toggleFavorite } = useToggleFavorite();
  const deleteMutation = useDeleteImage();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    // Validate prompt
    const validation = imageRoutingEngine.validatePrompt(prompt);
    if (!validation.valid) {
      alert(validation.issues.join('\n'));
      return;
    }

    const image = await generateMutation.mutateAsync({
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      style,
      size,
      quality,
    });

    setGeneratedImages((prev) => [image, ...prev]);
    setSelectedImage(image);

    if (onImageGenerated) {
      onImageGenerated(image);
    }
  };

  const handleEnhancePrompt = () => {
    const enhanced = imageRoutingEngine.suggestPromptEnhancement(prompt, style);
    setPrompt(enhanced);
  };

  const handleCreateVariation = async (imageId: string) => {
    const variation = await createVariationMutation.mutateAsync(imageId);
    setGeneratedImages((prev) => [variation, ...prev]);
    setSelectedImage(variation);
  };

  const handleDownload = async (image: GeneratedImage) => {
    const response = await fetch(image.image_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-${image.id}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    alert('Prompt copied to clipboard!');
  };

  const handleDelete = async (imageId: string) => {
    if (confirm('Delete this image? This cannot be undone.')) {
      await deleteMutation.mutateAsync(imageId);
      setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    }
  };

  const models = imageRoutingEngine.getAvailableImageModels();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="models">Model Info</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Generation Form */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt">Prompt *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEnhancePrompt}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enhance Prompt
                  </Button>
                </div>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  className="min-h-[100px]"
                  disabled={generateMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  {prompt.length}/1000 characters
                </p>
              </div>

              {/* Negative Prompt */}
              <div className="space-y-2">
                <Label htmlFor="negativePrompt">Negative Prompt (optional)</Label>
                <Textarea
                  id="negativePrompt"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="What to avoid in the image..."
                  className="min-h-[60px]"
                  disabled={generateMutation.isPending}
                />
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Style */}
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={(v) => setStyle(v as ImageStyleType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photorealistic">Photorealistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="illustration">Illustration</SelectItem>
                      <SelectItem value="sketch">Sketch</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={(v) => setSize(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                      <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                      <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality */}
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <Select value={quality} onValueChange={(v) => setQuality(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hd">HD (Higher Cost)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generateMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Images Gallery */}
          {showGallery && generatedImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Images</h3>

              {/* Selected Image (Large Preview) */}
              {selectedImage && (
                <Card>
                  <CardContent className="p-4">
                    <div className="relative group">
                      <img
                        src={selectedImage.image_url}
                        alt={selectedImage.prompt}
                        className="w-full rounded-lg"
                      />

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(selectedImage)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleFavorite(selectedImage.id, selectedImage.is_favorite)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              selectedImage.is_favorite ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCreateVariation(selectedImage.id)}
                          disabled={createVariationMutation.isPending}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(selectedImage.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Image Metadata */}
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">Prompt:</p>
                          <p className="text-sm text-muted-foreground">{selectedImage.prompt}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyPrompt(selectedImage.prompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{selectedImage.style}</Badge>
                        <Badge variant="outline">{selectedImage.size}</Badge>
                        <Badge variant="outline">{selectedImage.quality}</Badge>
                        <Badge variant="secondary">
                          {(selectedImage.generation_time_ms / 1000).toFixed(1)}s
                        </Badge>
                      </div>

                      {selectedImage.model_id && (
                        <ModelIndicator
                          model={selectedImage.model_id as any}
                          cost={selectedImage.cost_cents / 100}
                          reasoning={selectedImage.routing_decision?.reasoning}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {generatedImages.map((image) => (
                  <Card
                    key={image.id}
                    className={`cursor-pointer transition-all ${
                      selectedImage?.id === image.id
                        ? 'ring-2 ring-primary'
                        : 'hover:ring-2 hover:ring-muted'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <CardContent className="p-2">
                      <img
                        src={image.thumbnail_url || image.image_url}
                        alt={image.prompt.slice(0, 50)}
                        className="w-full aspect-square object-cover rounded"
                      />
                      {image.is_favorite && (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500 absolute top-3 right-3" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model) => (
              <Card key={model.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{model.name}</h3>
                      <Badge variant="outline">{model.provider}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">{model.description}</p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Strengths:</p>
                      <div className="flex flex-wrap gap-1">
                        {model.strengths.map((strength, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Best For:</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {model.bestFor.map((use, i) => (
                          <li key={i}>{use}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-muted-foreground">Speed: {model.speed}</span>
                      <span className="font-medium">{model.cost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
