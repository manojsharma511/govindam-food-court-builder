import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2, Pencil, BedDouble } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const roomSchema = z.object({
    branchId: z.string().min(1, 'Branch is required'),
    name: z.string().min(2, 'Name is required'),
    type: z.string().min(2, 'Type is required'),
    price: z.coerce.number().min(1, 'Price must be positive'),
    capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
    isAvailable: z.boolean().default(true),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomData extends RoomFormValues {
    id: string;
    branch?: { name: string };
    images?: string[];
}

interface Branch {
    id: string;
    name: string;
}

const AdminRooms = () => {
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
    const { toast } = useToast();

    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            isAvailable: true,
            price: 0,
            capacity: 2
        }
    });

    const fetchData = async () => {
        try {
            const { data: roomsData } = await api.get('/rooms');
            const { data: branchesData } = await api.get('/branches');
            setRooms(roomsData);
            setBranches(branchesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to load rooms or branches',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (editingRoom) {
            form.reset({
                ...editingRoom,
                price: Number(editingRoom.price), // Ensure number
                capacity: Number(editingRoom.capacity)
            });
        } else {
            form.reset({
                branchId: '',
                name: '',
                type: '',
                price: 0,
                capacity: 2,
                isAvailable: true,
            });
        }
    }, [editingRoom, form]);

    const onSubmit = async (values: RoomFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingRoom) {
                await api.put(`/rooms/${editingRoom.id}`, values);
                toast({ title: 'Success', description: 'Room updated successfully' });
            } else {
                await api.post('/rooms', values);
                toast({ title: 'Success', description: 'Room created successfully' });
            }
            setIsDialogOpen(false);
            setEditingRoom(null);
            fetchData();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save room',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this room?')) return;
        try {
            await api.delete(`/rooms/${id}`);
            toast({
                title: 'Success',
                description: 'Room deleted successfully',
            });
            fetchData();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete room",
                variant: "destructive"
            });
        }
    };

    const openCreateDialog = () => {
        setEditingRoom(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (room: RoomData) => {
        setEditingRoom(room);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Room Management</h2>
                    <p className="text-muted-foreground">Manage rooms across all branches</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingRoom(null);
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" onClick={openCreateDialog}>
                            <Plus className="w-4 h-4" />
                            Add Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Branch</label>
                                <Select
                                    onValueChange={(val) => form.setValue('branchId', val)}
                                    defaultValue={editingRoom?.branchId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map(b => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.branchId && (
                                    <p className="text-sm text-destructive mt-1">{form.formState.errors.branchId.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Room Name/Number</label>
                                    <Input {...form.register('name')} placeholder="e.g. 101 or Ocean View" />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Type</label>
                                    <Input {...form.register('type')} placeholder="e.g. Deluxe, Suite" />
                                    {form.formState.errors.type && (
                                        <p className="text-sm text-destructive mt-1">{form.formState.errors.type.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Price</label>
                                    <Input type="number" {...form.register('price')} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">max Capacity</label>
                                    <Input type="number" {...form.register('capacity')} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox id="isAvailable" checked={form.watch('isAvailable')} onCheckedChange={(c) => form.setValue('isAvailable', !!c)} />
                                <label htmlFor="isAvailable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Available for Booking
                                </label>
                            </div>

                            <Button type="submit" variant="hero" className="w-full shadow-gold mt-4" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingRoom ? 'Update Room' : 'Create Room')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Room</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Branch</TableHead>
                            <TableHead>Price/Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : rooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No rooms found
                                </TableCell>
                            </TableRow>
                        ) : (
                            rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <BedDouble className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{room.name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{room.type}</TableCell>
                                    <TableCell>
                                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                                            {room.branch?.name || 'Unknown'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            ₹{room.price} <span className="text-muted-foreground text-xs">/ night</span>
                                            <div className="text-xs text-muted-foreground">Cap: {room.capacity}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {room.isAvailable ?
                                            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded">Available</span> :
                                            <span className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded">Booked/Unavailable</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(room)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(room.id)}
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

export default AdminRooms;
