import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2, Pencil, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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

const branchSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    hasFoodCourt: z.boolean().default(true),
    hasRooms: z.boolean().default(false),
    isActive: z.boolean().default(true),
});

type BranchFormValues = z.infer<typeof branchSchema>;

interface BranchData extends BranchFormValues {
    id: string;
}

const AdminBranches = () => {
    const [branches, setBranches] = useState<BranchData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
    const { toast } = useToast();

    const form = useForm<BranchFormValues>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            hasFoodCourt: true,
            hasRooms: false,
            isActive: true,
        }
    });

    const fetchBranches = async () => {
        try {
            const { data } = await api.get('/branches');
            setBranches(data);
        } catch (error) {
            console.error('Error fetching branches:', error);
            toast({
                title: 'Error',
                description: 'Failed to load branches',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        if (editingBranch) {
            form.reset(editingBranch);
        } else {
            form.reset({
                name: '',
                slug: '',
                address: '',
                city: '',
                state: '',
                email: '',
                phone: '',
                hasFoodCourt: true,
                hasRooms: false,
                isActive: true,
            });
        }
    }, [editingBranch, form]);

    const onSubmit = async (values: BranchFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingBranch) {
                await api.put(`/branches/${editingBranch.id}`, values);
                toast({ title: 'Success', description: 'Branch updated successfully' });
            } else {
                await api.post('/branches', values);
                toast({ title: 'Success', description: 'Branch created successfully' });
            }
            setIsDialogOpen(false);
            setEditingBranch(null);
            fetchBranches();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save branch',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this branch?')) return;
        try {
            await api.delete(`/branches/${id}`);
            toast({
                title: 'Success',
                description: 'Branch deleted successfully',
            });
            fetchBranches();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete branch",
                variant: "destructive"
            });
        }
    };

    const openCreateDialog = () => {
        setEditingBranch(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (branch: BranchData) => {
        setEditingBranch(branch);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Branch Management</h2>
                    <p className="text-muted-foreground">Manage your hotel branches</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingBranch(null);
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" onClick={openCreateDialog}>
                            <Plus className="w-4 h-4" />
                            Add Branch
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Create New Branch'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Branch Name</label>
                                    <Input {...form.register('name')} placeholder="e.g. Govindam Palace" />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Slug</label>
                                    <Input {...form.register('slug')} placeholder="e.g. palace" />
                                    {form.formState.errors.slug && (
                                        <p className="text-sm text-destructive mt-1">{form.formState.errors.slug.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                                    <Input {...form.register('email')} type="email" placeholder="branch@example.com" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Phone</label>
                                    <Input {...form.register('phone')} placeholder="+91..." />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Address</label>
                                <Input {...form.register('address')} placeholder="Full Address" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">City</label>
                                    <Input {...form.register('city')} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">State</label>
                                    <Input {...form.register('state')} />
                                </div>
                            </div>

                            <div className="flex gap-6 mt-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="hasFoodCourt" checked={form.watch('hasFoodCourt')} onCheckedChange={(c) => form.setValue('hasFoodCourt', !!c)} />
                                    <label htmlFor="hasFoodCourt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Food Court
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="hasRooms" checked={form.watch('hasRooms')} onCheckedChange={(c) => form.setValue('hasRooms', !!c)} />
                                    <label htmlFor="hasRooms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Rooms/Stay
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="isActive" checked={form.watch('isActive')} onCheckedChange={(c) => form.setValue('isActive', !!c)} />
                                    <label htmlFor="isActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Active
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" variant="hero" className="w-full shadow-gold mt-4" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingBranch ? 'Update Branch' : 'Create Branch')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Features</TableHead>
                            <TableHead>Status</TableHead>
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
                        ) : branches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No branches found
                                </TableCell>
                            </TableRow>
                        ) : (
                            branches.map((branch) => (
                                <TableRow key={branch.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{branch.name}</p>
                                                <p className="text-xs text-muted-foreground">{branch.slug}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {branch.city && <span>{branch.city}</span>}
                                            {branch.state && <span className="text-muted-foreground">, {branch.state}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 text-xs">
                                            {branch.hasFoodCourt && <span className="bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded">Dining</span>}
                                            {branch.hasRooms && <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">Rooms</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {branch.isActive ?
                                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded">Active</span> :
                                            <span className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded">Inactive</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(branch)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(branch.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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

export default AdminBranches;
