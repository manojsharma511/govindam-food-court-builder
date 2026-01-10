import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2, Shield, User, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { format } from 'date-fns';

const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
});

type AdminFormValues = z.infer<typeof adminSchema>;

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  { id: 'manage_menu', label: 'Manage Menu' },
  { id: 'manage_orders', label: 'Manage Orders' },
  { id: 'manage_bookings', label: 'Manage Bookings' },
  { id: 'manage_cms', label: 'Manage Website' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const { toast } = useToast();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      permissions: [],
      role: 'ADMIN',
    }
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      form.reset({
        name: editingUser.name,
        email: editingUser.email,
        permissions: editingUser.permissions || [],
        role: editingUser.role,
        password: '', // Don't prefill password
      });
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        permissions: [],
        role: 'ADMIN',
      });
    }
  }, [editingUser, form]);

  const onSubmit = async (values: AdminFormValues) => {
    if (!editingUser && !values.password) {
      form.setError('password', { message: 'Password is required for new users' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, values);
        toast({ title: 'Success', description: 'User updated successfully' });
      } else {
        await api.post('/users/admin', values);
        toast({ title: 'Success', description: 'Admin created successfully' });
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage system administrators and users</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingUser(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openCreateDialog}>
              <Plus className="w-4 h-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create New Admin'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <Input {...form.register('name')} placeholder="User Name" />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input {...form.register('email')} type="email" placeholder="user@example.com" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Password {editingUser && <span className="text-muted-foreground font-normal">(Leave blank to keep current)</span>}
                </label>
                <Input {...form.register('password')} type="password" placeholder={editingUser ? "New Password (optional)" : "••••••••"} />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={perm.id}
                        className="h-4 w-4 rounded border-gray-300"
                        {...form.register('permissions')}
                      />
                      <label className="text-sm">{perm.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full shadow-gold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingUser ? 'Update User' : 'Create Admin')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${user.role === 'SUPER_ADMIN'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : user.role === 'ADMIN'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                      }`}>
                      {user.role === 'SUPER_ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.role === 'SUPER_ADMIN' ? (
                      <span className="text-xs text-muted-foreground">All Access</span>
                    ) : user.permissions && user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map(p => {
                          const label = ALL_PERMISSIONS.find(ap => ap.id === p)?.label || p;
                          return (
                            <span key={p} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                              {label}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {user.role !== 'SUPER_ADMIN' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
