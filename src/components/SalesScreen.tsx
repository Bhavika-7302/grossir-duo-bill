
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, ShoppingCart, Trash2, Upload } from 'lucide-react';
import SearchBar from './SearchBar';
import BillModal from './BillModal';
import DuplicateItemModal from './DuplicateItemModal';
import PriceMismatchModal from './PriceMismatchModal';
import UnitConverter from './UnitConverter';
import ExcelImport from './ExcelImport';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  unit: 'kg' | 'grams' | 'liters' | 'ml' | 'pieces';
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
}

const SalesScreen = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Milk', price: 3.50, stock: 25, category: 'Dairy', barcode: '1234567890123', unit: 'liters' },
    { id: '2', name: 'Bread', price: 2.50, stock: 15, category: 'Bakery', barcode: '1234567890124', unit: 'pieces' },
    { id: '3', name: 'Eggs', price: 12.00, stock: 8, category: 'Dairy', barcode: '1234567890125', unit: 'pieces' },
    { id: '4', name: 'Rice', price: 15.00, stock: 0, category: 'Grains', barcode: '1234567890126', unit: 'kg' },
    { id: '5', name: 'Chicken', price: 25.00, stock: 12, category: 'Meat', barcode: '1234567890127', unit: 'kg' },
    { id: '6', name: 'Vegetables', price: 8.50, stock: 20, category: 'Fresh', barcode: '1234567890128', unit: 'kg' },
    { id: '7', name: 'Fruits', price: 8.25, stock: 18, category: 'Fresh', barcode: '1234567890129', unit: 'kg' },
    { id: '8', name: 'Salt', price: 4.25, stock: 5, category: 'Condiments', barcode: '1234567890130', unit: 'grams' }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBill, setShowBill] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showPriceMismatchModal, setShowPriceMismatchModal] = useState(false);
  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [duplicateItem, setDuplicateItem] = useState<Product | null>(null);
  const [mismatchItem, setMismatchItem] = useState<{ product: Product; expectedPrice: number } | null>(null);
  const [convertingItem, setConvertingItem] = useState<{ product: Product; currentQuantity: number } | null>(null);

  const categories = [...new Set(products.map(p => p.category))];

  const handleItemSelect = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
      setCart(prev => prev.filter(item => item.id !== productId));
    }
    setSelectedItems(newSelected);
  };

  const handleProductSelect = (product: Product, quantity: number = 1, unit?: string) => {
    if (product.stock === 0) return;

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setDuplicateItem(product);
      setShowDuplicateModal(true);
      return;
    }

    if (Math.random() < 0.1) {
      setMismatchItem({ product, expectedPrice: product.price * 1.1 });
      setShowPriceMismatchModal(true);
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      unit: unit || product.unit,
      total: product.price * quantity
    };

    setCart(prev => [...prev, cartItem]);
    setSelectedItems(prev => new Set([...prev, product.id]));
  };

  const handleBarcodeSearch = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      handleProductSelect(product);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
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
          ? { ...item, quantity: newQuantity, unit: newUnit, total: item.price * newQuantity }
          : item
      ));
    }
  };

  const handleExcelImport = (importedProducts: Product[]) => {
    setProducts(prev => [...prev, ...importedProducts]);
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handleGenerateBill = () => {
    if (cart.length === 0) return;
    setShowBill(true);
  };

  const clearCart = () => {
    setCart([]);
    setSelectedItems(new Set());
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
          onClick={() => setShowExcelImport(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Import Excel/CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛒 Product Catalog
                <Badge variant="secondary">{products.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categories.map(category => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.filter(p => p.category === category).map(product => (
                      <div
                        key={product.id}
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          product.stock === 0 
                            ? 'bg-gray-50 border-gray-200' 
                            : selectedItems.has(product.id)
                            ? 'bg-blue-50 border-blue-300 shadow-sm'
                            : 'bg-white border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedItems.has(product.id)}
                              onCheckedChange={(checked) => handleItemSelect(product.id, checked as boolean)}
                              disabled={product.stock === 0}
                            />
                            <div>
                              <h4 className="font-medium text-gray-800">{product.name}</h4>
                              <p className="text-sm text-gray-600">
                                ${product.price.toFixed(2)} per {product.unit}
                              </p>
                              {product.barcode && (
                                <p className="text-xs text-gray-500">Barcode: {product.barcode}</p>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={product.stock === 0 ? "destructive" : product.stock < 5 ? "secondary" : "outline"}
                          >
                            Stock: {product.stock}
                          </Badge>
                        </div>

                        {selectedItems.has(product.id) && (
                          <div className="flex items-center justify-between pt-2 border-t">
                            {cart.find(item => item.id === product.id) ? (
                              <div className="flex items-center gap-2 flex-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const item = cart.find(item => item.id === product.id);
                                    if (item) updateQuantity(product.id, item.quantity - 1);
                                  }}
                                >
                                  <Minus size={16} />
                                </Button>
                                <span className="mx-2 font-medium min-w-[40px] text-center">
                                  {cart.find(item => item.id === product.id)?.quantity || 0}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const item = cart.find(item => item.id === product.id);
                                    if (item && item.quantity < product.stock) {
                                      updateQuantity(product.id, item.quantity + 1);
                                    }
                                  }}
                                >
                                  <Plus size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUnitConversion(product.id)}
                                  title="Convert units"
                                >
                                  🔄
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(product.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleProductSelect(product)}
                                disabled={product.stock === 0}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Plus size={16} className="mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Cart
                <Badge variant="secondary">{cart.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items in cart</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} × {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.total.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 p-1 h-auto"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="flex-1"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleGenerateBill}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Generate Bill
                    </Button>
                  </div>
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
          onClose={() => setShowBill(false)}
          onComplete={clearCart}
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

      {showExcelImport && (
        <ExcelImport
          isOpen={showExcelImport}
          onClose={() => setShowExcelImport(false)}
          onImport={handleExcelImport}
        />
      )}
    </div>
  );
};

export default SalesScreen;
