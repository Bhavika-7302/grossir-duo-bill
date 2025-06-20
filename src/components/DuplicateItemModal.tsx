
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface DuplicateItemModalProps {
  item: Product;
  onClose: () => void;
}

const DuplicateItemModal = ({ item, onClose }: DuplicateItemModalProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-orange-600">Duplicate Item Warning</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            <strong>{item.name}</strong> is already in your cart. 
            You can update the quantity using the quantity controls instead of adding it again.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-orange-800 text-sm">
              💡 <strong>Tip:</strong> Use the +/- buttons next to items in your cart to change quantities.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-orange-600 hover:bg-orange-700">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateItemModal;
