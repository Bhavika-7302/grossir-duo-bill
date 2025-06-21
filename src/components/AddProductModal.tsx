
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera } from 'lucide-react';
import MobileBarcodeScanner from './MobileBarcodeScanner';

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

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
  editProduct?: Product;
}

const AddProductModal = ({ isOpen, onClose, onAdd, editProduct }: AddProductModalProps) => {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: editProduct?.name || '',
    purchasePrice: editProduct?.purchasePrice?.toString() || '',
    mrp: editProduct?.mrp?.toString() || '',
    salePrice: editProduct?.salePrice?.toString() || '',
    stock: editProduct?.stock?.toString() || '',
    category: editProduct?.category || '',
    barcode: editProduct?.barcode || '',
    unit: editProduct?.unit || 'pieces' as const
  });

  const categories = ['Dairy', 'Bakery', 'Grains', 'Meat', 'Fresh', 'Condiments', 'Beverages'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.salePrice) return;

    onAdd({
      name: formData.name,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      mrp: parseFloat(formData.mrp) || 0,
      salePrice: parseFloat(formData.salePrice),
      stock: parseInt(formData.stock) || 0,
      category: formData.category,
      barcode: formData.barcode,
      unit: formData.unit
    });

    // Reset form
    setFormData({
      name: '',
      purchasePrice: '',
      mrp: '',
      salePrice: '',
      stock: '',
      category: '',
      barcode: '',
      unit: 'pieces'
    });
    onClose();
  };

  const handleBarcodeScanned = (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowBarcodeScanner(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? 'ఉత్పత్తిని ఎడిట్ చేయండి / Edit Product' : 'కొత్త ఉత్పత్తిని జోడించండి / Add New Product'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">ఉత్పత్తి పేరు / Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">వర్గం / Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit">యూనిట్ / Unit</Label>
              <Select value={formData.unit} onValueChange={(value: any) => setFormData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="ml">ML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="purchasePrice">కొనుగోలు ధర / Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="mrp">MRP</Label>
                <Input
                  id="mrp"
                  type="number"
                  step="0.01"
                  value={formData.mrp}
                  onChange={(e) => setFormData(prev => ({ ...prev, mrp: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="salePrice">అమ్మకపు ధర / Sale Price *</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="stock">స్టాక్ / Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="barcode">బార్‌కోడ్ / Barcode</Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                  placeholder="స్కాన్ చేయండి లేదా టైప్ చేయండి / Scan or type"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowBarcodeScanner(true)}
                >
                  <Camera size={16} />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                రద్దు చేయండి / Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editProduct ? 'అప్‌డేట్ చేయండి / Update' : 'జోడించండి / Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <MobileBarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </>
  );
};

export default AddProductModal;
