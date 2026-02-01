
import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

const gallerySchema = z.object({
  url: z.string().url("Valid URL is required"),
  caption: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

const categories = [
  { id: 'food', label: 'Food' },
  { id: 'ambiance', label: 'Ambiance' },
  { id: 'team', label: 'Details' }, // Changed from 'team' to match user perception if needed, or keep generic
  { id: 'events', label: 'Events' },
  { id: 'other', label: 'Other' }
];

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      url: "",
      caption: "",
      category: "food",
    },
  });

  const fetchImages = async () => {
    try {
      const res = await api.get("/gallery");
      setImages(res.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching images",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const onSubmit = async (data: GalleryFormValues) => {
    try {
      await api.post("/gallery", data);
      toast({ title: "Image added successfully" });
      setIsDialogOpen(false);
      form.reset();
      fetchImages();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding image",
        description: "Something went wrong.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast({ title: "Image deleted" });
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting image",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">Gallery Management</h2>
          <p className="text-muted-foreground">Manage your website gallery images.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-gold text-primary-foreground border-0">
              <Plus className="w-5 h-5 mr-2" /> Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Source</FormLabel>
                      <FormControl className="space-y-3">
                        <>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append('image', file);

                                try {
                                  toast({ title: "Uploading image..." });
                                  const res = await api.post('/upload', formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' }
                                  });
                                  field.onChange(res.data.url);
                                  toast({ title: "Image uploaded successfully" });
                                } catch (err) {
                                  toast({ variant: "destructive", title: "Upload failed", description: "Could not upload image." });
                                }
                              }}
                            />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">- OR -</span>
                          </div>
                          <Input placeholder="Enter Image URL directly..." {...field} />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Production description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add Image</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {images.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-square overflow-hidden">
                <img src={image.url} alt={image.caption || 'Gallery Image'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-md" onClick={() => handleDelete(image.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 backdrop-blur-sm">
                  <p className="text-white text-xs truncate text-center">{image.caption}</p>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="text-[10px] font-bold uppercase bg-primary text-black px-2 py-0.5 rounded-full shadow-sm">
                  {image.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No gallery images found.</p>
            <Button variant="link" onClick={() => setIsDialogOpen(true)}>Add your first image</Button>
          </div>
        )}
      </div>
    </div>
  );
}
