ALTER TABLE public.reviews
ALTER COLUMN product_id TYPE TEXT USING product_id::text;
