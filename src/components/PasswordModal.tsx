
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  message: string;
}

const PasswordModal = ({ isOpen, onClose, onSuccess, title, message }: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin password check (you can modify this)
    if (password === '123456') {
      onSuccess();
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('తప్పుడు పాస్‌వర్డ్ / Incorrect password');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{message}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">పాస్‌వర్డ్ / Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="పాస్‌వర్డ్ ఎంటర్ చేయండి / Enter password"
                required
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                రద్దు చేయండి / Cancel
              </Button>
              <Button type="submit" className="flex-1">
                నిర్ధారించండి / Confirm
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;
