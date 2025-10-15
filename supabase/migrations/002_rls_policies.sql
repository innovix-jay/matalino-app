-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_link_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products policies
CREATE POLICY "Users can view their own products" ON public.products
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = creator_id);

-- Public read access to published products (for storefronts)
CREATE POLICY "Anyone can view published products" ON public.products
  FOR SELECT USING (is_published = true);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert orders for their products" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Email subscribers policies
CREATE POLICY "Users can view their own subscribers" ON public.email_subscribers
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own subscribers" ON public.email_subscribers
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own subscribers" ON public.email_subscribers
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own subscribers" ON public.email_subscribers
  FOR DELETE USING (auth.uid() = creator_id);

-- Email campaigns policies
CREATE POLICY "Users can view their own campaigns" ON public.email_campaigns
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own campaigns" ON public.email_campaigns
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own campaigns" ON public.email_campaigns
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own campaigns" ON public.email_campaigns
  FOR DELETE USING (auth.uid() = creator_id);

-- Bio links policies
CREATE POLICY "Users can view their own bio links" ON public.bio_links
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own bio links" ON public.bio_links
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own bio links" ON public.bio_links
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own bio links" ON public.bio_links
  FOR DELETE USING (auth.uid() = creator_id);

-- Public read access to published bio links
CREATE POLICY "Anyone can view published bio links" ON public.bio_links
  FOR SELECT USING (is_published = true);

-- Bio link blocks policies
CREATE POLICY "Users can view blocks for their bio links" ON public.bio_link_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bio_links 
      WHERE id = bio_link_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert blocks for their bio links" ON public.bio_link_blocks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bio_links 
      WHERE id = bio_link_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update blocks for their bio links" ON public.bio_link_blocks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.bio_links 
      WHERE id = bio_link_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete blocks for their bio links" ON public.bio_link_blocks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.bio_links 
      WHERE id = bio_link_id AND creator_id = auth.uid()
    )
  );

-- Public read access to blocks for published bio links
CREATE POLICY "Anyone can view blocks for published bio links" ON public.bio_link_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bio_links 
      WHERE id = bio_link_id AND is_published = true
    )
  );

-- AI usage policies
CREATE POLICY "Users can view their own AI usage" ON public.ai_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI usage" ON public.ai_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can view their own analytics" ON public.analytics_events
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
