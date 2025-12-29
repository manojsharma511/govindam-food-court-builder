import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminGallery = () => {
  // Mock data for now as we don't have a Gallery model in schema yet
  // In a real app, this would query a Gallery table
  const [images, setImages] = useState([
    { id: '1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', title: 'Restaurant Interior' },
    { id: '2', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe', title: 'Signature Dish' },
  ]);
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = () => {
    if (!newUrl) return;
    const newImage = {
      id: Date.now().toString(),
      url: newUrl,
      title: 'New Image'
    };
    setImages([newImage, ...images]);
    setNewUrl('');
  };

  const handleDelete = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Gallery Management</h2>

      <div className="bg-card rounded-xl p-6 border border-border space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Add Image URL</label>
            <Input
              placeholder="https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleAdd}>
            <Upload className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-border">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No images in gallery</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
