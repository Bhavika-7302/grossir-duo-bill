
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

interface PriceMismatchModalProps {
  item: Product;
  expectedPrice: number;
  onClose: () => void;
  onContinue: () => void;
}

const PriceMismatchModal = ({ item, expectedPrice, onClose, onContinue }: PriceMismatchModalProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Price Mismatch Detected</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            There's a price discrepancy for <strong>{item.name}</strong>:
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>System Price:</span>
              <span className="font-medium">${item.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Price:</span>
              <span className="font-medium text-red-600">${expectedPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Difference:</span>
              <span className="font-medium text-red-600">
                ${Math.abs(expectedPrice - item.price).toFixed(2)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">
            Please verify the price before continuing with the sale.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={onContinue} className="flex-1 bg-red-600 hover:bg-red-700">
            Continue with System Price
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceMismatchModal;
