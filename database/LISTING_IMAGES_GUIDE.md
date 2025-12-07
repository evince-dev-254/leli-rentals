# Complete Listing Creation Flow with Image Uploads

## Overview
This guide shows the complete flow for owners to create listings with multiple images uploaded to ImageKit.

## Database Field
```sql
-- listings table already has:
images TEXT[] -- Array of ImageKit URLs
```

## Step-by-Step Flow

### 1. Frontend: Owner Fills Listing Form
```tsx
// components/listings/create-listing-form.tsx
const [images, setImages] = useState<File[]>([]);
const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

// User selects multiple images
<input 
  type="file" 
  multiple 
  accept="image/*"
  onChange={(e) => setImages(Array.from(e.target.files || []))}
/>
```

### 2. Upload Images to ImageKit
```tsx
// Upload each image to ImageKit
const uploadImagesToImageKit = async (files: File[]) => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `listing-${Date.now()}-${file.name}`);
    formData.append('folder', '/listings');

    const response = await fetch('/api/imagekit/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.url; // ImageKit URL
  });

  const urls = await Promise.all(uploadPromises);
  return urls;
};
```

### 3. API Route for ImageKit Upload
```typescript
// app/api/imagekit/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const folder = formData.get('folder') as string;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder,
    });

    return NextResponse.json({
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 4. Create Listing with Image URLs
```typescript
// lib/actions/listing-actions.ts
'use server'

import { supabase } from '@/lib/supabase';

export async function createListing(data: {
  categoryId: string;
  subcategoryId: string;
  title: string;
  description: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[]; // ImageKit URLs
  features: Record<string, any>;
  depositAmount?: number;
  insuranceRequired?: boolean;
  minRentalPeriod?: number;
  maxRentalPeriod?: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Generate slug
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      owner_id: user.id,
      category_id: data.categoryId,
      subcategory_id: data.subcategoryId,
      title: data.title,
      slug: `${slug}-${Date.now()}`,
      description: data.description,
      price_per_day: data.pricePerDay,
      price_per_week: data.pricePerWeek,
      price_per_month: data.pricePerMonth,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      images: data.images, // Array of ImageKit URLs
      features: data.features,
      deposit_amount: data.depositAmount,
      insurance_required: data.insuranceRequired,
      min_rental_period: data.minRentalPeriod || 1,
      max_rental_period: data.maxRentalPeriod,
    })
    .select()
    .single();

  if (error) throw error;
  return listing;
}
```

### 5. Complete Form Submission
```tsx
// components/listings/create-listing-form.tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Step 1: Upload images to ImageKit
    const imageUrls = await uploadImagesToImageKit(images);
    
    // Step 2: Create listing with ImageKit URLs
    const listing = await createListing({
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      title: formData.title,
      description: formData.description,
      pricePerDay: parseFloat(formData.pricePerDay),
      pricePerWeek: formData.pricePerWeek ? parseFloat(formData.pricePerWeek) : undefined,
      pricePerMonth: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : undefined,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      images: imageUrls, // ImageKit URLs array
      features: formData.features,
      depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : undefined,
      insuranceRequired: formData.insuranceRequired,
      minRentalPeriod: formData.minRentalPeriod,
      maxRentalPeriod: formData.maxRentalPeriod,
    });

    // Success!
    router.push(`/dashboard/listings/${listing.id}`);
  } catch (error) {
    console.error('Error creating listing:', error);
    setError('Failed to create listing');
  } finally {
    setLoading(false);
  }
};
```

## SQL Examples

### Insert Listing with Multiple Images
```sql
INSERT INTO public.listings (
    owner_id,
    category_id,
    title,
    slug,
    description,
    price_per_day,
    location,
    images -- Multiple ImageKit URLs
) VALUES (
    auth.uid(),
    'category-uuid',
    'Luxury Apartment',
    'luxury-apartment-123',
    'Beautiful 3-bedroom apartment',
    5000.00,
    'Westlands, Nairobi',
    ARRAY[
        'https://ik.imagekit.io/jsmasterypaul/listings/apt-main.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/apt-bedroom.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/apt-kitchen.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/apt-bathroom.jpg',
        'https://ik.imagekit.io/jsmasterypaul/listings/apt-view.jpg'
    ]
);
```

### Query Listing with Images
```sql
SELECT 
    id,
    title,
    images, -- Returns array of all ImageKit URLs
    images[1] as main_image, -- First image
    array_length(images, 1) as image_count
FROM public.listings
WHERE id = 'listing-uuid';
```

### Update Listing Images
```sql
-- Add new images
UPDATE public.listings
SET images = images || ARRAY[
    'https://ik.imagekit.io/jsmasterypaul/listings/new-image.jpg'
]
WHERE id = 'listing-uuid'
AND owner_id = auth.uid();

-- Replace all images
UPDATE public.listings
SET images = ARRAY[
    'https://ik.imagekit.io/jsmasterypaul/listings/updated-1.jpg',
    'https://ik.imagekit.io/jsmasterypaul/listings/updated-2.jpg'
]
WHERE id = 'listing-uuid'
AND owner_id = auth.uid();

-- Remove specific image
UPDATE public.listings
SET images = array_remove(images, 'https://ik.imagekit.io/jsmasterypaul/listings/old.jpg')
WHERE id = 'listing-uuid'
AND owner_id = auth.uid();
```

## Image Display with Transformations

### Thumbnail (200x200)
```tsx
<img 
  src={`${listing.images[0]}?tr=w-200,h-200,c-at_max`}
  alt={listing.title}
/>
```

### Gallery View (800x600)
```tsx
{listing.images.map((url, index) => (
  <img 
    key={index}
    src={`${url}?tr=w-800,h-600,c-at_max`}
    alt={`${listing.title} - Image ${index + 1}`}
  />
))}
```

### Optimized for Web
```tsx
<img 
  src={`${listing.images[0]}?tr=q-80,f-auto`}
  alt={listing.title}
/>
```

## Image Validation

### Frontend Validation
```tsx
const validateImages = (files: File[]) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxImages = 10;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (files.length > maxImages) {
    throw new Error(`Maximum ${maxImages} images allowed`);
  }

  files.forEach(file => {
    if (file.size > maxSize) {
      throw new Error(`Image ${file.name} is too large. Max 5MB`);
    }
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.name}`);
    }
  });
};
```

## Complete Example

```typescript
// Complete listing creation with images
const createListingWithImages = async (formData: FormData, imageFiles: File[]) => {
  // 1. Validate images
  validateImages(imageFiles);

  // 2. Upload to ImageKit
  const imageUrls = await uploadImagesToImageKit(imageFiles);
  // Returns: [
  //   'https://ik.imagekit.io/jsmasterypaul/listings/img1.jpg',
  //   'https://ik.imagekit.io/jsmasterypaul/listings/img2.jpg',
  //   'https://ik.imagekit.io/jsmasterypaul/listings/img3.jpg'
  // ]

  // 3. Create listing in database
  const listing = await createListing({
    ...formData,
    images: imageUrls, // Store ImageKit URLs
  });

  return listing;
};
```

## Summary

✅ **Database**: `listings.images` field stores array of ImageKit URLs  
✅ **Upload**: Images uploaded to ImageKit via API route  
✅ **Storage**: ImageKit URLs stored in database  
✅ **Display**: Use ImageKit transformations for different sizes  
✅ **Update**: Can add/remove/replace images anytime  
✅ **Validation**: File size, type, and count validation  

The system is fully ready for owners to upload multiple images when creating listings!
