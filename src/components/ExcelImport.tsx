
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  unit: 'kg' | 'grams' | 'liters' | 'ml' | 'pieces';
}

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

const ExcelImport = ({ isOpen, onClose, onImport }: ExcelImportProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  const downloadTemplate = () => {
    const template = `name,price,stock,category,barcode,unit
Milk,3.50,25,Dairy,1234567890123,liters
Bread,2.50,15,Bakery,1234567890124,pieces
Eggs,12.00,8,Dairy,1234567890125,dozen
Rice,15.00,0,Grains,1234567890126,kg
Chicken,25.00,12,Meat,1234567890127,kg`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): Product[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const products: Product[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length >= 6) {
        const product: Product = {
          id: Date.now().toString() + i,
          name: values[0] || '',
          price: parseFloat(values[1]) || 0,
          stock: parseInt(values[2]) || 0,
          category: values[3] || 'General',
          barcode: values[4] || '',
          unit: (values[5] as any) || 'pieces'
        };
        
        if (product.name && product.price > 0) {
          products.push(product);
        }
      }
    }
    
    return products;
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setImportStatus('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const products = parseCSV(text);
        
        if (products.length > 0) {
          onImport(products);
          setImportStatus(`Successfully imported ${products.length} products`);
          setTimeout(() => {
            onClose();
            setImportStatus('');
          }, 2000);
        } else {
          setImportStatus('No valid products found in the file');
        }
      } catch (error) {
        setImportStatus('Error parsing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Products from Excel/CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Upload a CSV file with your product data. Make sure it includes columns for: name, price, stock, category, barcode, and unit.
          </div>

          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="w-full"
          >
            <Download size={16} className="mr-2" />
            Download Template
          </Button>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">
              Drag and drop your CSV file here, or
            </p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>Choose File</span>
              </Button>
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {importStatus && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              importStatus.includes('Successfully') 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <AlertCircle size={16} />
              <span className="text-sm">{importStatus}</span>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <strong>CSV Format:</strong> name,price,stock,category,barcode,unit<br/>
            <strong>Units:</strong> kg, grams, liters, ml, pieces
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImport;
