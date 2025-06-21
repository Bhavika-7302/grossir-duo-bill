
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: { name: string; phone: string }) => void;
  initialDetails?: { name: string; phone: string };
}

const CustomerDetailsModal = ({ isOpen, onClose, onSave, initialDetails }: CustomerDetailsModalProps) => {
  const [name, setName] = useState(initialDetails?.name || '');
  const [phone, setPhone] = useState(initialDetails?.phone || '');

  const handleSave = () => {
    onSave({ name, phone });
    onClose();
  };

  const handleSkip = () => {
    onSave({ name: '', phone: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>కస్టమర్ వివరాలు / Customer Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerName">కస్టమర్ పేరు / Customer Name</Label>
            <Input
              id="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="వైకల్పిక / Optional"
            />
          </div>
          
          <div>
            <Label htmlFor="customerPhone">ఫోన్ నంబర్ / Phone Number</Label>
            <Input
              id="customerPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="వైకల్పిక / Optional"
              type="tel"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              దాటవేయండి / Skip
            </Button>
            <Button onClick={handleSave} className="flex-1">
              సేవ్ చేయండి / Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
