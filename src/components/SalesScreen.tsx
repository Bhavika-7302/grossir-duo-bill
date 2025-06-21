import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, ShoppingCart, Trash2, User } from 'lucide-react';
import SearchBar from './SearchBar';
import BillModal from './BillModal';
import DuplicateItemModal from './DuplicateItemModal';
import PriceMismatchModal from './PriceMismatchModal';
import UnitConverter from './UnitConverter';
import CustomerDetailsModal from './CustomerDetailsModal';

interface Product {
  id: string;
  name: string;
  purchasePrice: number;
  mrp: number;
  salePrice: number;
  stock: number;
  category: string;
  barcode?: string;
  unit: 'kg' | 'grams' | 'liters' | 'ml' | 'pieces';
}

interface CartItem {
  id: string;
  name: string;
  purchasePrice: number;
  mrp: number;
  salePrice: number;
  quantity: number;
  unit: string;
  total: number;
  savings: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
}

const SalesScreen = () => {
  const [products] = useState<Product[]>([
    { id: '1', name: 'మిల్క్ / Milk', purchasePrice: 3.00, mrp: 4.00, salePrice: 3.50, stock: 25, category: 'డెయిరీ / Dairy', barcode: '1234567890123', unit: 'liters' },
    { id: '2', name: 'బ్రెడ్ / Bread', purchasePrice: 2.00, mrp: 3.00, salePrice: 2.50, stock: 15, category: 'బేకరీ / Bakery', barcode: '1234567890124', unit: 'pieces' },
    { id: '3', name: 'గుడ్లు / Eggs', purchasePrice: 10.00, mrp: 14.00, salePrice: 12.00, stock: 8, category: 'డెయిరీ / Dairy', barcode: '1234567890125', unit: 'pieces' },
    { id: '4', name: 'బియ్యం / Rice', purchasePrice: 12.00, mrp: 18.00, salePrice: 15.00, stock: 0, category: 'ధాన్యాలు / Grains', barcode: '1234567890126', unit: 'kg' }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showBill, setShowBill] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showPriceMismatchModal, setShowPriceMismatchModal] = useState(false);
  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [duplicateItem, setDuplicateItem] = useState<Product | null>(null);
  const [mismatchItem, setMismatchItem] = useState<{ product: Product; expectedPrice: number } | null>(null);
  const [convertingItem, setConvertingItem] = useState<{ product: Product; currentQuantity: number } | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: '', phone: '' });

  const generateBillNumber = () => {
    const timestamp = Date.now().toString().slice(-5);
    return `VV${timestamp.padStart(5, '0')}`;
  };

  const handleProductSelect = (product: Product, quantity: number = 1, unit?: string) => {
    if (product.stock === 0) return;

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setDuplicateItem(product);
      setShowDuplicateModal(true);
      return;
    }

    // Check for price mismatch (10% probability)
    if (Math.random() < 0.1) {
      setMismatchItem({ product, expectedPrice: product.salePrice * 1.1 });
      setShowPriceMismatchModal(true);
      return;
    }

    const savings = (product.mrp - product.salePrice) * quantity;
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      purchasePrice: product.purchasePrice,
      mrp: product.mrp,
      salePrice: product.salePrice,
      quantity,
      unit: unit || product.unit,
      total: product.salePrice * quantity,
      savings
    };

    setCart(prev => [...prev, cartItem]);
  };

  const handleBarcodeSearch = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      handleProductSelect(product);
    } else {
      alert('ఉత్పత్తి కనుగొనబడలేదు / Product not found');
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { 
            ...item, 
            quantity: newQuantity, 
            total: item.salePrice * newQuantity,
            savings: (item.mrp - item.salePrice) * newQuantity
          }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleUnitConversion = (productId: string) => {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (cartItem && product) {
      setConvertingItem({ product, currentQuantity: cartItem.quantity });
      setShowUnitConverter(true);
    }
  };

  const applyUnitConversion = (newQuantity: number, newUnit: string) => {
    if (convertingItem) {
      setCart(prev => prev.map(item =>
        item.id === convertingItem.product.id
          ? { 
              ...item, 
              quantity: newQuantity, 
              unit: newUnit, 
              total: item.salePrice * newQuantity,
              savings: (item.mrp - item.salePrice) * newQuantity
            }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const getTotalSavings = () => {
    return cart.reduce((sum, item) => sum + item.savings, 0);
  };

  const handleGenerateBill = () => {
    if (cart.length === 0) return;
    setShowCustomerModal(true);
  };

  const handleCustomerDetailsSaved = (details: CustomerDetails) => {
    setCustomerDetails(details);
    setShowBill(true);
  };

  const clearCart = () => {
    setCart([]);
    setCustomerDetails({ name: '', phone: '' });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          products={products}
          onProductSelect={handleProductSelect}
          onBarcodeSearch={handleBarcodeSearch}
        />
        <Button
          onClick={() => setShowCustomerModal(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <User size={16} />
          కస్టమర్ వివరాలు / Customer Details
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cart Section - Now taking more space */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                కార్ట్ / Cart
                <Badge variant="secondary">{cart.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">కార్ట్‌లో వస్తువులు లేవు / No items in cart</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>MRP:</span>
                              <span className="line-through">₹{item.mrp.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>అమ్మకపు ధర / Sale Price:</span>
                              <span className="font-medium">₹{item.salePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>సేవ్ / You Save:</span>
                              <span>₹{((item.mrp - item.salePrice) * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="mx-2 font-medium min-w-[40px] text-center">
                            {item.quantity} {item.unit}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const product = products.find(p => p.id === item.id);
                              if (product && item.quantity < product.stock) {
                                updateQuantity(item.id, item.quantity + 1);
                              }
                            }}
                          >
                            <Plus size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnitConversion(item.id)}
                            title="యూనిట్ మార్చండి / Convert units"
                          >
                            🔄
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{item.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>మొత్తం మొత్తం / Subtotal:</span>
                      <span>₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                      <span>మొత్తం సేవింగ్స్ / Total Savings:</span>
                      <span className="font-bold">₹{getTotalSavings().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>చెల్లించవలసిన మొత్తం / Total:</span>
                      <span className="text-blue-600">₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="flex-1"
                    >
                      క్లియర్ చేయండి / Clear
                    </Button>
                    <Button
                      onClick={handleGenerateBill}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      బిల్ జనరేట్ చేయండి / Generate Bill
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Info Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>కస్టమర్ సమాచారం / Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              {customerDetails.name || customerDetails.phone ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>పేరు / Name:</span>
                    <span>{customerDetails.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ఫోన్ / Phone:</span>
                    <span>{customerDetails.phone || 'N/A'}</span>
                  </div>
                  <Button
                    onClick={() => setShowCustomerModal(true)}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    వివరాలను మార్చండి / Edit Details
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-4">కస్టమర్ వివరాలు జోడించబడలేదు / No customer details added</p>
                  <Button
                    onClick={() => setShowCustomerModal(true)}
                    variant="outline"
                  >
                    కస్టమర్ వివరాలను జోడించండి / Add Customer Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showBill && (
        <BillModal
          cart={cart}
          total={getTotalAmount()}
          totalSavings={getTotalSavings()}
          customerDetails={customerDetails}
          billNumber={generateBillNumber()}
          onClose={() => setShowBill(false)}
          onComplete={clearCart}
        />
      )}

      {showCustomerModal && (
        <CustomerDetailsModal
          isOpen={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          onSave={handleCustomerDetailsSaved}
          initialDetails={customerDetails}
        />
      )}

      {showDuplicateModal && duplicateItem && (
        <DuplicateItemModal
          item={duplicateItem}
          onClose={() => {
            setShowDuplicateModal(false);
            setDuplicateItem(null);
          }}
        />
      )}

      {showPriceMismatchModal && mismatchItem && (
        <PriceMismatchModal
          item={mismatchItem.product}
          expectedPrice={mismatchItem.expectedPrice}
          onClose={() => {
            setShowPriceMismatchModal(false);
            setMismatchItem(null);
          }}
          onContinue={() => {
            handleProductSelect(mismatchItem.product);
            setShowPriceMismatchModal(false);
            setMismatchItem(null);
          }}
        />
      )}

      {showUnitConverter && convertingItem && (
        <UnitConverter
          isOpen={showUnitConverter}
          onClose={() => {
            setShowUnitConverter(false);
            setConvertingItem(null);
          }}
          onConvert={applyUnitConversion}
          currentUnit={convertingItem.product.unit}
        />
      )}
    </div>
  );
};

export default SalesScreen;
