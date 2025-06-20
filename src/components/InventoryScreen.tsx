
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  minStock: number;
}

const InventoryScreen = () => {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Milk', price: 3.50, stock: 25, category: 'Dairy', minStock: 10 },
    { id: '2', name: 'Bread', price: 2.50, stock: 15, category: 'Bakery', minStock: 5 },
    { id: '3', name: 'Eggs', price: 12.00, stock: 8, category: 'Dairy', minStock: 12 },
    { id: '4', name: 'Rice', price: 15.00, stock: 0, category: 'Grains', minStock: 5 },
    { id: '5', name: 'Chicken', price: 25.00, stock: 12, category: 'Meat', minStock: 8 },
    { id: '6', name: 'Vegetables', price: 8.50, stock: 20, category: 'Fresh', minStock: 15 },
    { id: '7', name: 'Fruits', price: 8.25, stock: 18, category: 'Fresh', minStock: 10 },
    { id: '8', name: 'Salt', price: 4.25, stock: 5, category: 'Condiments', minStock: 3 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (product.stock <= product.minStock) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockItems = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-blue-100">Total Items</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <div className="text-green-100">Inventory Value</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <div className="text-orange-100">Low Stock</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{outOfStockItems}</div>
            <div className="text-red-100">Out of Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📦 Inventory Management
            <div className="flex gap-2">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button className="bg-green-600 hover:bg-green-700">
                Add New Item
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Product Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Price</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Stock</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Min Stock</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium text-gray-800">{product.name}</td>
                      <td className="p-3 text-gray-600">{product.category}</td>
                      <td className="p-3 text-right font-medium">${product.price.toFixed(2)}</td>
                      <td className="p-3 text-center font-semibold">{product.stock}</td>
                      <td className="p-3 text-center text-gray-600">{product.minStock}</td>
                      <td className="p-3 text-center">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="p-3 text-right font-semibold text-green-600">
                        ${(product.price * product.stock).toFixed(2)}
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
  );
};

export default InventoryScreen;
