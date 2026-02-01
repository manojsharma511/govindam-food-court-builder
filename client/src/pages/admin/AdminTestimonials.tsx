import { useState, useEffect } from "react";
import { Plus, Trash2, MessageSquare, Loader2, Star, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

const testimonialSchema = z.object({
    customerName: z.string().min(1, "Name is required"),
    customerRole: z.string().optional(),
    rating: z.coerce.number().min(1).max(5),
    review: z.string().min(1, "Review is required"),
    imageUrl: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface Testimonial {
    id: string;
    customerName: string;
    customerRole?: string;
    rating: number;
    review: string;
    imageUrl?: string;
    isVisible: boolean;
}

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<TestimonialFormValues>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            customerName: "",
            customerRole: "",
            rating: 5,
            review: "",
            imageUrl: "",
        },
    });

    const fetchTestimonials = async () => {
        try {
            const res = await api.get("/testimonials");
            setTestimonials(res.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching testimonials",
                description: "Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const onSubmit = async (data: TestimonialFormValues) => {
        try {
            await api.post("/testimonials", data);
            toast({ title: "Testimonial added successfully" });
            setIsDialogOpen(false);
            form.reset();
            fetchTestimonials();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error adding testimonial",
                description: "Something went wrong.",
            });
        }
    };

    const handleToggleVisibility = async (testimonial: Testimonial) => {
        try {
            const updated = { ...testimonial, isVisible: !testimonial.isVisible };
            await api.put(`/testimonials/${testimonial.id}`, updated);

            setTestimonials(prev => prev.map(t => t.id === testimonial.id ? updated : t));

            toast({
                title: updated.isVisible ? "Review Approved" : "Review Hidden",
                description: updated.isVisible ? "The review is now visible on the site." : "The review is now hidden."
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error updating status",
                description: "Failed to update review visibility."
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        try {
            await api.delete(`/testimonials/${id}`);
            toast({ title: "Testimonial deleted" });
            setTestimonials((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error deleting testimonial",
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
                    <h2 className="text-3xl font-heading font-bold text-foreground">Testimonial Management</h2>
                    <p className="text-muted-foreground">Manage customer reviews and feedback.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-gold text-primary-foreground border-0">
                            <Plus className="w-5 h-5 mr-2" /> Add New Testimonial
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Testimonial</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Customer Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="customerRole"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Food Critic / Frequent Diner" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rating (1-5)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" max="5" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="review"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="The food was amazing..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Customer Image URL (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Add Testimonial</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {testimonials.map((t) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all relative group"
                        >
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={`h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${t.isVisible ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}`}
                                    onClick={() => handleToggleVisibility(t)}
                                    title={t.isVisible ? "Hide Review" : "Approve Review"}
                                >
                                    {t.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDelete(t.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted relative">
                                    {t.imageUrl ? (
                                        <img src={t.imageUrl} alt={t.customerName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                                            {t.customerName.charAt(0)}
                                        </div>
                                    )}
                                    {!t.isVisible && (
                                        <div className="absolute inset-0 bg-yellow-500/30 flex items-center justify-center" title="Pending Approval">
                                            <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded font-bold">Pending</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground flex items-center gap-2">
                                        {t.customerName}
                                        {!t.isVisible && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full border border-yellow-200">Pending</span>}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">{t.customerRole || 'Customer'}</p>
                                </div>
                            </div>

                            <div className="flex mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                ))}
                            </div>

                            <p className="text-sm text-muted-foreground italic">"{t.review}"</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {testimonials.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No testimonials found.</p>
                        <Button variant="link" onClick={() => setIsDialogOpen(true)}>Add your first testimonial</Button>
                    </div>
                )}
            </div>
        </div >
    );
}
