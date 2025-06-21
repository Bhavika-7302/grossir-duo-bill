
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: string;
  name: string;
  purchasePrice: number;
  mrp: number;
  salePrice: number;
  quantity: number;
  total: number;
  savings: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
}

interface BillModalProps {
  cart: CartItem[];
  total: number;
  totalSavings: number;
  customerDetails: CustomerDetails;
  billNumber: string;
  onClose: () => void;
  onComplete: () => void;
}

const BillModal = ({ cart, total, totalSavings, customerDetails, billNumber, onClose, onComplete }: BillModalProps) => {
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleSendBill = () => {
    alert('బిల్ విజయవంతంగా పంపబడింది! / Bill sent successfully!');
    onComplete();
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>బిల్ జనరేట్ చేయబడింది / Bill Generated</DialogTitle>
        </DialogHeader>
        
        <div className="bill-content bg-white p-6 border rounded-lg" id="bill-print">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Grossir</h2>
            <p className="text-gray-600">గ్రాసరీ స్టోర్ / Grocery Store</p>
            <Separator className="my-2" />
          </div>

          <div className="mb-4 text-sm">
            <div className="flex justify-between">
              <span>బిల్ నంబర్ / Bill No:</span>
              <span className="font-medium">{billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>తేదీ & సమయం / Date & Time:</span>
              <span className="font-medium">{timestamp}</span>
            </div>
            {customerDetails.name && (
              <div className="flex justify-between">
                <span>కస్టమర్ / Customer:</span>
                <span className="font-medium">{customerDetails.name}</span>
              </div>
            )}
            {customerDetails.phone && (
              <div className="flex justify-between">
                <span>ఫోన్ / Phone:</span>
                <span className="font-medium">{customerDetails.phone}</span>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="text-sm">
                <div className="flex justify-between font-medium">
                  <span className="flex-1">{item.name}</span>
                  <span>₹{item.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>₹{item.salePrice.toFixed(2)} × {item.quantity}</span>
                  {item.savings > 0 && (
                    <span className="text-green-600">
                      సేవ్ / Save: ₹{item.savings.toFixed(2)}
                    </span>
                  )}
                </div>
                {item.mrp > item.salePrice && (
                  <div className="text-xs text-gray-500">
                    MRP: ₹{item.mrp.toFixed(2)} (₹{(item.mrp - item.salePrice).toFixed(2)} saved per item)
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>ఉప మొత్తం / Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>మొత్తం సేవింగ్స్ / Total Savings:</span>
                <span>₹{totalSavings.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>మొత్తం / Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-600">
            <p>మాతో షాపింగ్ చేసినందుకు ధన్యవాదాలు! / Thank you for shopping with us!</p>
            <p>మంచి రోజు కలుగుగాక! / Have a great day!</p>
            {totalSavings > 0 && (
              <p className="text-green-600 font-medium mt-2">
                మీరు ఈ రోజు ₹{totalSavings.toFixed(2)} ఆదా చేసుకున్నారు! / You saved ₹{totalSavings.toFixed(2)} today!
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            మూసివేయండి / Close
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            ప్రింట్ చేయండి / Print
          </Button>
          <Button onClick={handleSendBill} className="flex-1 bg-green-600 hover:bg-green-700">
            బిల్ పంపండి / Send Bill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillModal;
