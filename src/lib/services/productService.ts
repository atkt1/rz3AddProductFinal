// src/lib/services/productService.ts
import { supabase } from '../supabase';
import type { ProductFormData } from '../types/product';

async function optimizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.8
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = objectUrl;
  });
}

async function createThumbnail(file: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const canvas = document.createElement('canvas');
      const maxWidth = 200;
      const maxHeight = 200;
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create thumbnail'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.7
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for thumbnail'));
    };
    
    img.src = objectUrl;
  });
}

export async function createProduct(data: ProductFormData, userId: string) {
  try {
    if (!data.image) {
      throw new Error('Product image is required');
    }

    // Optimize main image
    const optimizedImage = await optimizeImage(data.image);
    
    // Create and upload thumbnail
    const thumbnail = await createThumbnail(optimizedImage);
    
    // Generate unique filenames
    const ext = data.image.name.split('.').pop() || 'jpg';
    const baseFilename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const imagePath = `${userId}/${baseFilename}.${ext}`;
    const thumbnailPath = `${userId}/${baseFilename}_thumb.${ext}`;

    // Upload both images
    const [imageUpload, thumbnailUpload] = await Promise.all([
      supabase.storage
        .from('products')
        .upload(imagePath, optimizedImage, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        }),
      supabase.storage
        .from('products')
        .upload(thumbnailPath, thumbnail, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        })
    ]);

    if (imageUpload.error) throw new Error(`Failed to upload image: ${imageUpload.error.message}`);
    if (thumbnailUpload.error) throw new Error(`Failed to upload thumbnail: ${thumbnailUpload.error.message}`);

    // Get public URLs
    const { data: { publicUrl: imageUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(imagePath);
      
    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(thumbnailPath);

    // Create product record
    const { error: insertError } = await supabase
      .from('products')
      .insert({
        name: data.name,
        marketplace: data.marketplace,
        marketplace_product_id: data.marketplace_product_id,
        giveaway: data.giveaway,
        image_path: imageUrl,
        thumbnail_path: thumbnailUrl,
        user_id: userId
      });

    if (insertError) {
      // Clean up uploaded images if product creation fails
      await Promise.all([
        supabase.storage.from('products').remove([imagePath]),
        supabase.storage.from('products').remove([thumbnailPath])
      ]);
      
      throw new Error(`Failed to create product: ${insertError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error instanceof Error ? error : new Error('Failed to create product');
  }
}
