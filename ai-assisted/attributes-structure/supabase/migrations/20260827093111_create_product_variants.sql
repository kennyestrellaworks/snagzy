/*
# Create product_variants table for per-variant media

1. New Tables
- `product_variants` stores each variant of a product, including its own images.
- `product_variants.id` is the generated variant identifier.
- `product_variants.product_id` links the variant to its parent product.
- `product_variants.name`, `sku`, `price`, and `stock_quantity` store variant-specific details.
- `product_variants.image_urls` stores the public URLs for this variant's uploaded images.
- `product_variants.created_at` tracks record history.

2. Security
- Enables row level security on `product_variants`.
- Adds separate SELECT, INSERT, UPDATE, and DELETE policies for the intentionally shared single-tenant catalog.

3. Important Notes
- Media now lives on the variant, not the product, so each variant can have different images.
- The `products.image_urls` column is retained but no longer used by the app.
*/

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  sku text NOT NULL DEFAULT '',
  price numeric(12, 2) NOT NULL DEFAULT 0,
  stock_quantity integer NOT NULL DEFAULT 0,
  image_urls text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_product_variants" ON public.product_variants;
CREATE POLICY "public_read_product_variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_product_variants" ON public.product_variants;
CREATE POLICY "public_insert_product_variants" ON public.product_variants FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "public_update_product_variants" ON public.product_variants;
CREATE POLICY "public_update_product_variants" ON public.product_variants FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "public_delete_product_variants" ON public.product_variants;
CREATE POLICY "public_delete_product_variants" ON public.product_variants FOR DELETE TO anon, authenticated USING (true);