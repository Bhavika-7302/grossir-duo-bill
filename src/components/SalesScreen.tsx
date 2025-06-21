import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import CustomerDetailsModal from './CustomerDetailsModal';
import BillModal from './BillModal';
import MobileBarcodeScanner from './MobileBarcodeScanner';
import PriceMismatchModal from './PriceMismatchModal';

interface Product {
  id: string;
  name: string;
  purchasePrice: number;
  mrp: number;
  salePrice: number;
  stock: number;
  category: string;
  barcode: string;
}

interface CartItem extends Product {
  quantity: number;
  total: number;
  savings: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
}

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

interface SearchBarProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onBarcodeFound: (barcode: string) => void;
}

const SearchBar = ({ products, onProductSelect, onBarcodeFound }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.barcode.includes(term)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Search by name or barcode"
        value={searchTerm}
        onChange={handleChange}
      />
      {searchResults.length > 0 && (
        <div className="mt-2 p-2 bg-white border rounded-md shadow-sm max-h-40 overflow-y-auto">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SalesScreen = () => {
  const { t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', phone: '' });
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [currentBillNumber, setCurrentBillNumber] = useState('');
  const [bills, setBills] = useState<Bill[]>([]);
  const [priceMismatch, setPriceMismatch] = useState<{ item: Product; expectedPrice: number } | null>(null);
  const [barcodeInputValue, setBarcodeInputValue] = useState('');

  // Sample products with all required properties
  const [products] = useState<Product[]>([
    { 
      id: '1', 
      name: 'Milk', 
      purchasePrice: 20, 
      mrp: 25, 
      salePrice: 23, 
      stock: 50, 
      category: 'Dairy',
      barcode: '1234567890'
    },
    { 
      id: '2', 
      name: 'Bread', 
      purchasePrice: 15, 
      mrp: 20, 
      salePrice: 18, 
      stock: 30, 
      category: 'Bakery',
      barcode: '2345678901'
    },
    { 
      id: '3', 
      name: 'Rice', 
      purchasePrice: 40, 
      mrp: 50, 
      salePrice: 45, 
      stock: 100, 
      category: 'Grains',
      barcode: '3456789012'
    },
    { 
      id: '4', 
      name: 'Chicken', 
      purchasePrice: 180, 
      mrp: 220, 
      salePrice: 200, 
      stock: 25, 
      category: 'Meat',
      barcode: '4567890123'
    },
    { 
      id: '5', 
      name: 'Vegetables', 
      purchasePrice: 30, 
      mrp: 40, 
      salePrice: 35, 
      stock: 60, 
      category: 'Vegetables',
      barcode: '5678901234'
    }
  ]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
  
    if (existingItem) {
      // Check for price mismatch
      if (existingItem.salePrice !== product.salePrice) {
        setPriceMismatch({ item: product, expectedPrice: existingItem.salePrice });
        return;
      }
  
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.salePrice, savings: (item.quantity + 1) * (item.mrp - item.salePrice) } : item
      );
      setCart(updatedCart);
    } else {
      const newItem = {
        ...product,
        quantity: 1,
        total: product.salePrice,
        savings: product.mrp - product.salePrice,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity,
            total: quantity * item.salePrice,
            savings: quantity * (item.mrp - item.salePrice),
          }
        : item
    );
    setCart(updatedCart);
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCustomerDetails = (details: CustomerDetails) => {
    setCustomerDetails(details);
    setShowCustomerModal(false);
    generateBill();
  };

  const generateBill = async () => {
    const newBillNumber = `BILL-${Math.floor(Math.random() * 10000)}`;
    setCurrentBillNumber(newBillNumber);
    setShowBillModal(true);
  };

  const handleCompleteSale = () => {
    const newBill: Bill = {
      id: currentBillNumber,
      billNo: currentBillNumber,
      total: total,
      timestamp: new Date().toLocaleString(),
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.salePrice,
        total: item.total,
      })),
    };

    setBills([...bills, newBill]);
    setCart([]);
    setCustomerDetails({ name: '', phone: '' });
  };

  const handleBarcodeFound = (barcode: string) => {
    setBarcodeInputValue(barcode);
    const foundProduct = products.find((product) => product.barcode === barcode);
    if (foundProduct) {
      addToCart(foundProduct);
    } else {
      alert(t('ఉత్పత్తి కనుగొనబడలేదు', 'Product not found'));
    }
    setShowBarcodeScanner(false);
  };

  const total = cart.reduce((sum, item) => sum + item.total, 0);
  const totalSavings = cart.reduce((sum, item) => sum + item.savings, 0);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Search and Cart */}
        <div className="lg:w-1/2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛒 {t('అమ్మకాలు', 'Sales')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchBar 
                products={products} 
                onProductSelect={addToCart}
                onBarcodeFound={handleBarcodeFound}
              />
              
              {/* Cart Items */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        ₹{item.salePrice.toFixed(2)} × {item.quantity} = ₹{item.total.toFixed(2)}
                      </div>
                      {item.savings > 0 && (
                        <div className="text-xs text-green-600">
                          {t('సేవ్', 'Save')}: ₹{item.savings.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        size="sm" 
                        variant="outline"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        size="sm" 
                        variant="outline"
                      >
                        +
                      </Button>
                      <Button 
                        onClick={() => removeFromCart(item.id)}
                        size="sm" 
                        variant="destructive"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('మొత్తం', 'Total')}:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>{t('మొత్తం సేవింగ్స్', 'Total Savings')}:</span>
                      <span>₹{totalSavings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={clearCart} 
                      variant="outline" 
                      className="flex-1"
                    >
                      {t('క్లియర్ చేయండి', 'Clear')}
                    </Button>
                    <Button 
                      onClick={() => setShowCustomerModal(true)} 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {t('చెక్‌అవుట్', 'Checkout')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Quick Actions */}
        <div className="lg:w-1/2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('త్వరిత చర్యలు', 'Quick Actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setShowBarcodeScanner(true)}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                📱 {t('మొబైల్ బార్‌కోడ్ స్కాన్', 'Mobile Barcode Scan')}
              </Button>
              
              <Button 
                onClick={() => setCart([])}
                variant="outline" 
                className="w-full h-12"
              >
                🗑️ {t('కార్ట్ క్లియర్ చేయండి', 'Clear Cart')}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Bills */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ఇటీవలి బిల్లులు', 'Recent Bills')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bills.slice(0, 5).map((bill) => (
                  <div key={bill.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{bill.billNo}</span>
                    <span className="text-green-600">₹{bill.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showCustomerModal && (
        <CustomerDetailsModal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onSave={handleCustomerDetails}
          initialDetails={customerDetails}
        />
      )}

      {showBillModal && (
        <BillModal
          cart={cart}
          total={total}
          totalSavings={totalSavings}
          customerDetails={customerDetails}
          billNumber={currentBillNumber}
          onClose={() => setShowBillModal(false)}
          onComplete={handleCompleteSale}
        />
      )}

      {showBarcodeScanner && (
        <MobileBarcodeScanner
          isOpen={showBarcodeScanner}
          onClose={() => setShowBarcodeScanner(false)}
          onBarcodeScanned={handleBarcodeFound}
        />
      )}

      {priceMismatch && (
        <PriceMismatchModal
          item={priceMismatch.item}
          expectedPrice={priceMismatch.expectedPrice}
          onClose={() => setPriceMismatch(null)}
          onContinue={() => {
            if (priceMismatch) {
              addToCart(priceMismatch.item);
              setPriceMismatch(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default SalesScreen;
