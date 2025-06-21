
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Camera } from 'lucide-react';
import AddProductModal from './AddProductModal';
import PasswordModal from './PasswordModal';

interface Product {
  id: string;
  name: string;
  purchasePrice: number;
  mrp: number;
  salePrice: number;
  stock: number;
  category: string;
  minStock: number;
  barcode?: string;
  unit: 'kg' | 'grams' | 'liters' | 'ml' | 'pieces';
}

const InventoryScreen = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'మిల్క్ / Milk', purchasePrice: 3.00, mrp: 4.00, salePrice: 3.50, stock: 25, category: 'డెయిరీ / Dairy', minStock: 10, barcode: '1234567890123', unit: 'liters' },
    { id: '2', name: 'బ్రెడ్ / Bread', purchasePrice: 2.00, mrp: 3.00, salePrice: 2.50, stock: 15, category: 'బేకరీ / Bakery', minStock: 5, barcode: '1234567890124', unit: 'pieces' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pendingAction, setPendingAction] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: 'స్టాక్ లేదు / Out of Stock', variant: 'destructive' as const };
    if (product.stock <= product.minStock) return { label: 'తక్కువ స్టాక్ / Low Stock', variant: 'secondary' as const };
    return { label: 'స్టాక్ లో ఉంది / In Stock', variant: 'default' as const };
  };

  const totalValue = products.reduce((sum, product) => sum + (product.salePrice * product.stock), 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockItems = products.filter(p => p.stock === 0).length;

  const handlePasswordSuccess = () => {
    if (pendingAction === 'add') {
      setShowAddModal(true);
    } else if (pendingAction === 'edit' && editingProduct) {
      setShowAddModal(true);
    } else if (pendingAction === 'delete' && productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
    setPendingAction(null);
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id, minStock: editingProduct.minStock }
          : p
      ));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        minStock: 5
      };
      setProducts(prev => [...prev, newProduct]);
    }
  };

  const initiateAdd = () => {
    setPendingAction('add');
    setEditingProduct(null);
    setShowPasswordModal(true);
  };

  const initiateEdit = (product: Product) => {
    setPendingAction('edit');
    setEditingProduct(product);
    setShowPasswordModal(true);
  };

  const initiateDelete = (productId: string) => {
    setPendingAction('delete');
    setProductToDelete(productId);
    setShowPasswordModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-blue-100">మొత్తం వస్తువులు / Total Items</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">₹{totalValue.toFixed(2)}</div>
              <div className="text-green-100">ఇన్వెంటరీ విలువ / Inventory Value</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{lowStockItems}</div>
              <div className="text-orange-100">తక్కువ స్టాక్ / Low Stock</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{outOfStockItems}</div>
              <div className="text-red-100">స్టాక్ లేదు / Out of Stock</div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              📦 ఇన్వెంటరీ నిర్వహణ / Inventory Management
              <div className="flex gap-2">
                <Input
                  placeholder="ఉత్పత్తులను వెతకండి / Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={initiateAdd}
                >
                  <Plus size={16} className="mr-2" />
                  కొత్త వస్తువు జోడించండి / Add New Item
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">ఉత్పత్తి పేరు / Product Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700">వర్గం / Category</th>
                    <th className="text-right p-3 font-semibold text-gray-700">కొనుగోలు ధర / Purchase</th>
                    <th className="text-right p-3 font-semibold text-gray-700">MRP</th>
                    <th className="text-right p-3 font-semibold text-gray-700">అమ్మకపు ధర / Sale</th>
                    <th className="text-center p-3 font-semibold text-gray-700">స్టాక్ / Stock</th>
                    <th className="text-center p-3 font-semibold text-gray-700">స్థితి / Status</th>
                    <th className="text-center p-3 font-semibold text-gray-700">చర్యలు / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product);
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-gray-800">{product.name}</div>
                            {product.barcode && (
                              <div className="text-xs text-gray-500">బార్‌కోడ్ / Barcode: {product.barcode}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">{product.category}</td>
                        <td className="p-3 text-right font-medium">₹{product.purchasePrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">₹{product.mrp.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium text-green-600">₹{product.salePrice.toFixed(2)}</td>
                        <td className="p-3 text-center font-semibold">{product.stock} {product.unit}</td>
                        <td className="p-3 text-center">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => initiateEdit(product)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => initiateDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onAdd={handleAddProduct}
          editProduct={editingProduct || undefined}
        />
      )}

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingAction(null);
          setEditingProduct(null);
          setProductToDelete(null);
        }}
        onSuccess={handlePasswordSuccess}
        title="పాస్‌వర్డ్ ధృవీకరణ / Password Verification"
        message="ఈ చర్యను కొనసాగించడానికి పాస్‌వర్డ్ ఎంటర్ చేయండి / Enter password to continue this action"
      />
    </>
  );
};

export default InventoryScreen;
