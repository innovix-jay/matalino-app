'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIContentGenerator } from '@/components/ai/ai-content-generator';
import { AIAssistantPopover } from '@/components/ai/ai-assistant-popover';
import { productSchema } from '@/lib/validations/product';

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormWithAIProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProductFormWithAI({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProductFormWithAIProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  const description = watch('description');
  const name = watch('name');
  const type = watch('type');

  const productSuggestions = [
    'Suggest pricing based on similar products',
    'Generate SEO keywords',
    'Create a launch strategy',
    'Suggest upsell opportunities',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Basic information about your product</CardDescription>
            </div>
            <AIAssistantPopover
              context={{
                location: 'product',
                metadata: { name, type },
              }}
              promptSuggestions={productSuggestions}
              triggerLabel="AI Help"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Ultimate Course Bundle"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Product Type *</Label>
            <Select
              onValueChange={(value) => setValue('type', value as any)}
              defaultValue={initialData?.type}
            >
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital_download">Digital Download</SelectItem>
                <SelectItem value="course">Online Course</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Description with AI Generator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <AIContentGenerator
                contentType="product_description"
                context={{ productName: name, productType: type }}
                existingContent={description}
                onGenerated={(content) => setValue('description', content)}
                triggerLabel="Generate Description"
              />
            </div>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your product, its benefits, and what makes it unique..."
              className={`min-h-[150px] ${errors.description ? 'border-destructive' : ''}`}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use the AI generator to create a compelling description, then edit as needed
            </p>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceType">Price Type *</Label>
              <Select
                onValueChange={(value) => setValue('priceType', value as any)}
                defaultValue={initialData?.priceType || 'one_time'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-Time Payment</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceAmount">Price (cents) *</Label>
              <Input
                id="priceAmount"
                type="number"
                {...register('priceAmount', { valueAsNumber: true })}
                placeholder="e.g., 9900 for $99.00"
                className={errors.priceAmount ? 'border-destructive' : ''}
              />
              {errors.priceAmount && (
                <p className="text-sm text-destructive">{errors.priceAmount.message}</p>
              )}
            </div>
          </div>

          {/* SEO Meta Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <AIContentGenerator
                contentType="meta_description"
                context={{ productName: name, description }}
                onGenerated={(content) => setValue('metaDescription', content)}
                triggerLabel="Generate SEO"
              />
            </div>
            <Textarea
              id="metaDescription"
              {...register('metaDescription')}
              placeholder="A brief description for search engines (150-160 characters)"
              className="min-h-[80px]"
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {watch('metaDescription')?.length || 0}/160 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
