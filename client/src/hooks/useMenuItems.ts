import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_veg: boolean | null;
  is_available: boolean | null;
  is_featured: boolean | null;
  sort_order: number | null;
  category?: MenuCategory;
}

export const useMenuCategories = () => {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as MenuCategory[];
    },
  });
};

export const useMenuItems = (categoryId?: string) => {
  return useQuery({
    queryKey: ['menu-items', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select(`
          *,
          category:menu_categories(*)
        `)
        .eq('is_available', true)
        .order('sort_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MenuItem[];
    },
  });
};

export const useFeaturedItems = () => {
  return useQuery({
    queryKey: ['featured-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:menu_categories(*)
        `)
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6);

      if (error) throw error;
      return data as MenuItem[];
    },
  });
};
