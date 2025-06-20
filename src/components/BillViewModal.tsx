
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Bill {
  id: string;
  billNo: string;
  total: number;
  timestamp: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

interface BillViewModalProps {
  bill: Bill;
  onClose: () => void;
}

const BillViewModal = ({ bill, onClose }: BillViewModalProps) => {
  const subtotal = bill.items.reduce((sum, item) => sum + item.total, 0);
  const discount = subtotal * 0.05; // 5% discount

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bill Details - {bill.billNo}</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-6 border rounded-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Grossir</h2>
            <p className="text-gray-600">Grocery Store</p>
            <Separator className="my-2" />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Bill No:</span>
              <span className="font-medium">{bill.billNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date & Time:</span>
              <span className="font-medium">{bill.timestamp}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 mb-4">
            {bill.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div className="font-medium">${item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount (5%):</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${bill.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>Thank you for shopping with us!</p>
            <p>Have a great day!</p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillViewModal;
