
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface BillModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onComplete: () => void;
}

const BillModal = ({ cart, total, onClose, onComplete }: BillModalProps) => {
  const billNumber = `BILL-${String(Date.now()).slice(-6)}`;
  const timestamp = new Date().toLocaleString();
  const discount = total * 0.05; // 5% discount
  const finalTotal = total - discount;

  const handleSendBill = () => {
    // Simulate sending bill (email/SMS)
    alert('Bill sent successfully!');
    onComplete();
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bill Generated</DialogTitle>
        </DialogHeader>
        
        <div className="bill-content bg-white p-6 border rounded-lg" id="bill-print">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Grossir</h2>
            <p className="text-gray-600">Grocery Store</p>
            <Separator className="my-2" />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Bill No:</span>
              <span className="font-medium">{billNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date & Time:</span>
              <span className="font-medium">{timestamp}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
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
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount (5%):</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>Thank you for shopping with us!</p>
            <p>Have a great day!</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            Print
          </Button>
          <Button onClick={handleSendBill} className="flex-1 bg-green-600 hover:bg-green-700">
            Send Bill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillModal;
