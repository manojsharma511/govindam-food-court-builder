import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Pencil, Trash2, Utensils, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { ImageUpload } from '@/components/ui/image-upload';

// Schema for Item
const itemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  price: z.any().transform(val => val.toString()),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

type ItemFormValues = z.infer<typeof itemSchema>;

// Schema for Category
const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  icon: z.string().optional(),
  sortOrder: z.string().transform((val) => parseInt(val, 10)).optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  isVeg: boolean;
  isAvailable: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

const AdminMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const itemForm = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      isVeg: true,
      isAvailable: true,
    }
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const fetchMenu = async () => {
    try {
      const { data } = await api.get('/menu');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({
        title: 'Error',
        description: 'Failed to load menu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Sync form with editingItem
  useEffect(() => {
    if (editingItem) {
      itemForm.reset({
        name: editingItem.name,
        description: editingItem.description || '',
        price: editingItem.price.toString(),
        imageUrl: editingItem.imageUrl || '',
        categoryId: editingItem.categoryId,
        isVeg: editingItem.isVeg,
        isAvailable: editingItem.isAvailable,
      });
    } else {
      itemForm.reset({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        isVeg: true,
        isAvailable: true,
        categoryId: '',
      });
    }
  }, [editingItem, itemForm]);

  const onItemSubmit = async (values: ItemFormValues) => {
    try {
      if (editingItem) {
        await api.put(`/menu/items/${editingItem.id}`, {
          ...values,
          price: parseFloat(values.price),
        });
        toast({ title: 'Success', description: 'Item updated successfully' });
      } else {
        await api.post('/menu/items', {
          ...values,
          price: parseFloat(values.price),
        });
        toast({ title: 'Success', description: 'Item added successfully' });
      }
      setIsItemDialogOpen(false);
      setEditingItem(null);
      fetchMenu();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save item', variant: 'destructive' });
    }
  };

  const onCategorySubmit = async (values: CategoryFormValues) => {
    try {
      await api.post('/menu/categories', {
        ...values,
        sortOrder: values.sortOrder || 0
      });
      toast({ title: 'Success', description: 'Category created successfully' });
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
      fetchMenu();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create category', variant: 'destructive' });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/menu/items/${id}`);
      toast({ title: 'Success', description: 'Item deleted' });
      fetchMenu();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete item', variant: 'destructive' });
    }
  };

  const openEditItemDialog = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  }

  const openAddItemDialog = () => {
    setEditingItem(null);
    setIsItemDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Menu Management</h2>
          <p className="text-muted-foreground">Manage your food menu and categories</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Animated Tab Switcher */}
          <div className="relative bg-muted/50 p-1 rounded-full flex gap-1 border border-border">
            <button
              onClick={() => setActiveTab('items')}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10 ${activeTab === 'items' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {activeTab === 'items' && (
                <motion.div
                  layoutId="menuTab"
                  className="absolute inset-0 bg-primary rounded-full shadow-gold"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Items
              </span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10 ${activeTab === 'categories' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {activeTab === 'categories' && (
                <motion.div
                  layoutId="menuTab"
                  className="absolute inset-0 bg-primary rounded-full shadow-gold"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xs">📁</span>
                Categories
              </span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'items' && (
        <>
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="text-primary text-xl">📋</span> Menu Items
            </h3>
            <Dialog open={isItemDialogOpen} onOpenChange={(open) => {
              setIsItemDialogOpen(open);
              if (!open) setEditingItem(null);
            }}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2 shadow-gold" onClick={openAddItemDialog}>
                  <Plus className="w-4 h-4" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-1.5 block">Item Name</label>
                      <Input {...itemForm.register('name')} placeholder="e.g. Butter Paneer" />
                      {itemForm.formState.errors.name && <p className="text-destructive text-xs">{itemForm.formState.errors.name.message}</p>}
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-1.5 block">Category</label>
                      <Select
                        onValueChange={(val) => itemForm.setValue('categoryId', val)}
                        value={itemForm.watch('categoryId')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {itemForm.formState.errors.categoryId && <p className="text-destructive text-xs">{itemForm.formState.errors.categoryId.message}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Price (₹)</label>
                      <Input {...itemForm.register('price')} type="number" placeholder="250" />
                      {itemForm.formState.errors.price && <p className="text-destructive text-xs">{itemForm.formState.errors.price.message as string}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Image</label>
                      <ImageUpload
                        value={itemForm.watch('imageUrl')}
                        onChange={(url) => itemForm.setValue('imageUrl', url)}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-1.5 block">Description</label>
                      <Textarea {...itemForm.register('description')} placeholder="Item description..." />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={itemForm.watch('isVeg')}
                        onCheckedChange={(checked) => itemForm.setValue('isVeg', checked)}
                      />
                      <label className="text-sm">Vegetarian</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={itemForm.watch('isAvailable')}
                        onCheckedChange={(checked) => itemForm.setValue('isAvailable', checked)}
                      />
                      <label className="text-sm">Available (Show on Menu)</label>
                    </div>
                  </div>
                  <Button type="submit" variant="hero" className="w-full shadow-gold" disabled={itemForm.formState.isSubmitting}>
                    {itemForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : (editingItem ? 'Update Item' : 'Add Item')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.flatMap(cat => cat.items.map(item => (
              <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Utensils className="w-8 h-8" />
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center rounded-t-xl z-20 pointer-events-none">
                      <span className="bg-destructive/90 text-white px-4 py-1.5 text-xs font-bold rounded-full border border-destructive-foreground/20 shadow-lg tracking-wider uppercase">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 p-2 flex gap-1 bg-gradient-to-l from-black/80 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-30">
                    <Button size="icon" className="h-8 w-8 bg-zinc-900 border border-zinc-700 hover:bg-primary hover:text-primary-foreground hover:border-primary text-white shadow-xl" onClick={() => openEditItemDialog(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" className="h-8 w-8 bg-zinc-900 border border-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600 text-red-500 shadow-xl" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold truncate pr-2">{item.name}</h3>
                    <div className={`w-4 h-4 flex-shrink-0 rounded-sm border-2 p-0.5 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {item.price}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="text-primary text-xl">📁</span> Meal Categories
            </h3>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2 shadow-gold"><Plus className="w-4 h-4" /> Add New Category</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
                <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1">Name</label>
                    <Input {...categoryForm.register('name')} placeholder="Starters" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1">Icon (Emoji)</label>
                    <Input {...categoryForm.register('icon')} placeholder="🥗" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1">Sort Order</label>
                    <Input {...categoryForm.register('sortOrder')} type="number" placeholder="1" />
                  </div>
                  <Button type="submit" variant="hero" className="w-full shadow-gold">Create Category</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl bg-secondary/50 w-12 h-12 flex items-center justify-center rounded-lg">{cat.icon || '📁'}</span>
                  <div>
                    <h3 className="font-bold">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.items.length} items</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" disabled>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
