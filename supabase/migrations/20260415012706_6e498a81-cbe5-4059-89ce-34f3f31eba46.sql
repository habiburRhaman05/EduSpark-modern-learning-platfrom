
-- Fix overly permissive notifications INSERT policy
DROP POLICY IF EXISTS "System creates notifications" ON public.notifications;
CREATE POLICY "Authenticated create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix public bucket listing - restrict to folder-level
DROP POLICY IF EXISTS "Avatar images are public" ON storage.objects;
CREATE POLICY "Avatar images are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Blog images are public" ON storage.objects;
CREATE POLICY "Blog images are public" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);
