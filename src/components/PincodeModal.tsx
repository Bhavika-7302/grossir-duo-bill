
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  downloadType: string;
}

const PincodeModal = ({ isOpen, onClose, onSuccess, downloadType }: PincodeModalProps) => {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin pincode check
    if (pincode === '123456') {
      onSuccess();
      setPincode('');
      setError('');
      onClose();
    } else {
      setError('తప్పుడు పిన్‌కోడ్ / Incorrect pincode');
    }
  };

  const handleClose = () => {
    setPincode('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>పిన్‌కోడ్ ధృవీకరణ / Pincode Verification</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {downloadType} డౌన్‌లోడ్ చేయడానికి పిన్‌కోడ్ ఎంటర్ చేయండి / Enter pincode to download {downloadType}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pincode">పిన్‌కోడ్ / Pincode</Label>
              <Input
                id="pincode"
                type="password"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-అంకెల పిన్‌కోడ్ / 6-digit pincode"
                maxLength={6}
                required
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                రద్దు చేయండి / Cancel
              </Button>
              <Button type="submit" className="flex-1">
                డౌన్‌లోడ్ చేయండి / Download
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PincodeModal;
