/*
# Create products catalog and public product image storage

1. New Tables
- `products` stores each product created in the admin catalog.
- `products.id` is the generated product identifier.
- `products.name`, `sku`, `category`, and `description` store basic product information.
- `products.price`, `discounted_price`, and `stock_quantity` store pricing and inventory.
- `products.publish_product` controls whether the product is visible to customers.
- `products.image_urls` stores the public URLs for uploaded product images.
- `products.created_at` and `updated_at` track record history.

2. Storage
- Creates the public `product-images` bucket for product photos.
- Allows the no-login catalog editor to upload, view, update, and remove files in that bucket.

3. Security
- Enables row level security on `products`.
- Adds separate SELECT, INSERT, UPDATE, and DELETE policies for the intentionally shared single-tenant catalog.
- Adds separate storage policies for the product image bucket.

4. Important Notes
- This app has no sign-in screen, so the anon role is intentionally permitted to manage the catalog.
- Image files are stored in Supabase Storage and their public URLs are saved on the product row.
*/

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(12, 2) NOT NULL DEFAULT 0,
  discounted_price numeric(12, 2) NOT NULL DEFAULT 0,
  stock_quantity integer NOT NULL DEFAULT 0,
  publish_product boolean NOT NULL DEFAULT true,
  image_urls text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_products" ON public.products;
CREATE POLICY "public_insert_products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_products" ON public.products;
CREATE POLICY "public_update_products" ON public.products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_products" ON public.products;
CREATE POLICY "public_delete_products" ON public.products FOR DELETE TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "public_upload_product_images" ON storage.objects;
CREATE POLICY "public_upload_product_images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "public_update_product_images" ON storage.objects;
CREATE POLICY "public_update_product_images" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "public_delete_product_images" ON storage.objects;
CREATE POLICY "public_delete_product_images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'product-images');