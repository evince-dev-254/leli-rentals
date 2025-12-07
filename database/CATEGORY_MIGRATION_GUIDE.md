# Category UUID Migration Guide

## Overview
This migration properly sets up categories in the database with UUIDs while maintaining compatibility with the frontend's string-based category system.

## Files Created
1. **`database/seed_categories.sql`** - Seeds all categories with predefined UUIDs
2. **`lib/category-uuid-map.ts`** - TypeScript mapping between string IDs and UUIDs
3. **Updated `components/dashboard/create-listing.tsx`** - Now converts string IDs to UUIDs

## Migration Steps

### Step 1: Run the Seed Script
Go to your **Supabase Dashboard** → **SQL Editor** and run the contents of `database/seed_categories.sql`

This will:
- Insert all 12 categories with predefined UUIDs
- Create a helpful `category_id_mapping` view for reference
- Use `ON CONFLICT` to safely update existing categories

### Step 2: Verify the Data
After running the seed script, verify the categories were inserted:

```sql
SELECT * FROM public.categories ORDER BY display_order;
```

You should see 12 categories with UUIDs like:
- `11111111-1111-1111-1111-111111111111` for Vehicles
- `44444444-4444-4444-4444-444444444444` for Electronics
- etc.

### Step 3: Test Listing Creation
1. Refresh your application
2. Go to **Dashboard** → **Create Listing**
3. Fill in all required fields:
   - Title
   - Category (select any)
   - Description
   - At least 1 image
   - Pricing
   - City/County
   - Area/Neighborhood
4. Click **Create Listing**

The listing should now be created successfully!

## How It Works

### Frontend → Database Flow
1. User selects category "Electronics" (string ID)
2. `getCategoryUUID("electronics")` converts it to `44444444-4444-4444-4444-444444444444`
3. Listing is created with the UUID in `category_id` column
4. Database accepts it because it's a valid UUID that exists in the `categories` table

### Category ID Mapping
```typescript
{
  vehicles: '11111111-1111-1111-1111-111111111111',
  homes: '22222222-2222-2222-2222-222222222222',
  equipment: '33333333-3333-3333-3333-333333333333',
  electronics: '44444444-4444-4444-4444-444444444444',
  fashion: '55555555-5555-5555-5555-555555555555',
  entertainment: '66666666-6666-6666-6666-666666666666',
  events: '77777777-7777-7777-7777-777777777777',
  photography: '88888888-8888-8888-8888-888888888888',
  fitness: '99999999-9999-9999-9999-999999999999',
  baby: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  office: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  bikes: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
}
```

## Benefits of This Approach

✅ **Production-Safe**: Uses proper database foreign keys and UUIDs  
✅ **Data Integrity**: Categories are properly normalized in the database  
✅ **Backward Compatible**: Frontend code still uses simple string IDs  
✅ **Type-Safe**: TypeScript mapping ensures correct conversions  
✅ **Scalable**: Easy to add new categories by updating both files  

## Troubleshooting

### Error: "Invalid category selected"
- Make sure you ran the seed script in Supabase
- Verify categories exist: `SELECT * FROM categories;`

### Error: "Foreign key violation"
- The category UUID doesn't exist in the database
- Re-run the seed script

### Error: "400 Bad Request"
- Check the browser console for the actual Supabase error
- Verify all required fields are filled
- Check that images array is not empty

## Adding New Categories

To add a new category:

1. **Generate a new UUID** (use a pattern like `dddddddd-dddd-dddd-dddd-dddddddddddd`)
2. **Add to `seed_categories.sql`**:
   ```sql
   ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'New Category', 'new-category', 'Description', 13, true, NOW(), NOW())
   ```
3. **Add to `category-uuid-map.ts`**:
   ```typescript
   'new-category': 'dddddddd-dddd-dddd-dddd-dddddddddddd'
   ```
4. **Add to `categories-data.ts`**:
   ```typescript
   { id: "new-category", name: "New Category", ... }
   ```
5. **Run the seed script** to insert the new category

## Notes

- UUIDs are intentionally simple (e.g., all 1s, all 2s) for easy identification
- The `category_id_mapping` view provides a quick reference
- Always keep the three files in sync when adding categories
