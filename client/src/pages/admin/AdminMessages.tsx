import { useState, useEffect } from 'react';
import { Loader2, Mail, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '@/lib/api';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Contact Messages</h2>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User Details</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{msg.name}</div>
                    <div className="text-xs text-muted-foreground">{msg.email}</div>
                    {msg.phone && <div className="text-xs text-muted-foreground">{msg.phone}</div>}
                  </TableCell>
                  <TableCell>{msg.subject || 'No Subject'}</TableCell>
                  <TableCell className="max-w-md truncate" title={msg.message}>{msg.message}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Message Details</DialogTitle>
                          <DialogDescription>
                            Sent on {format(new Date(msg.createdAt), 'PPpp')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Name</p>
                              <p className="text-sm">{msg.name}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Email</p>
                              <p className="text-sm">{msg.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Phone</p>
                              <p className="text-sm">{msg.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Subject</p>
                              <p className="text-sm">{msg.subject || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Message Content</p>
                            <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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

export default AdminMessages;
