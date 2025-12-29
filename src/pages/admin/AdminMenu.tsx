import { useState, useEffect } from 'react';
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Menu Management</h2>
          <p className="text-muted-foreground">Manage your food menu and categories</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </Button>
          <Button
            variant={activeTab === 'items' ? 'default' : 'outline'}
            onClick={() => setActiveTab('items')}
          >
            Items
          </Button>
        </div>
      </div>

      {activeTab === 'items' && (
        <>
          <div className="flex justify-end">
            <Dialog open={isItemDialogOpen} onOpenChange={(open) => {
              setIsItemDialogOpen(open);
              if (!open) setEditingItem(null);
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={openAddItemDialog}>
                  <Plus className="w-4 h-4" />
                  Add Item
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
                      {itemForm.formState.errors.price && <p className="text-destructive text-xs">{itemForm.formState.errors.price.message}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Image URL</label>
                      <Input {...itemForm.register('imageUrl')} placeholder="https://..." />
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
                  <Button type="submit" className="w-full" disabled={itemForm.formState.isSubmitting}>
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
                  <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEditItemDialog(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center pointer-events-none">
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded transform rotate-12 border-2 border-white shadow-lg">UNAVAILABLE</span>
                    </div>
                  )}
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
          <div className="flex justify-end">
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4" /> Add Category</Button>
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
                  <Button type="submit" className="w-full">Create</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl bg-muted w-12 h-12 flex items-center justify-center rounded-lg">{cat.icon || '📁'}</span>
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
