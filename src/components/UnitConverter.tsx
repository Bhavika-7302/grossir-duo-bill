
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UnitConverterProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (quantity: number, unit: string) => void;
  currentUnit: string;
}

const UnitConverter = ({ isOpen, onClose, onConvert, currentUnit }: UnitConverterProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<string>(currentUnit);

  const unitCategories = {
    weight: [
      { value: 'kg', label: 'Kilograms', factor: 1 },
      { value: 'grams', label: 'Grams', factor: 1000 },
    ],
    volume: [
      { value: 'liters', label: 'Liters', factor: 1 },
      { value: 'ml', label: 'Milliliters', factor: 1000 },
    ],
    count: [
      { value: 'pieces', label: 'Pieces', factor: 1 },
      { value: 'dozen', label: 'Dozen', factor: 12 },
    ]
  };

  const getAllUnits = () => {
    return [...unitCategories.weight, ...unitCategories.volume, ...unitCategories.count];
  };

  const convertQuantity = (fromQty: number, fromUnit: string, toUnit: string) => {
    const allUnits = getAllUnits();
    const fromUnitData = allUnits.find(u => u.value === fromUnit);
    const toUnitData = allUnits.find(u => u.value === toUnit);

    if (!fromUnitData || !toUnitData) return fromQty;

    // Convert to base unit first, then to target unit
    const baseQuantity = fromQty / fromUnitData.factor;
    return baseQuantity * toUnitData.factor;
  };

  const handleConvert = () => {
    const convertedQuantity = convertQuantity(quantity, currentUnit, selectedUnit);
    onConvert(convertedQuantity, selectedUnit);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Unit Converter</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="unit">Convert to Unit</Label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <div className="font-semibold text-sm text-gray-600 px-2 py-1">Weight</div>
                {unitCategories.weight.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
                <div className="font-semibold text-sm text-gray-600 px-2 py-1 mt-2">Volume</div>
                {unitCategories.volume.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
                <div className="font-semibold text-sm text-gray-600 px-2 py-1 mt-2">Count</div>
                {unitCategories.count.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> {quantity} {currentUnit} = {' '}
              {convertQuantity(quantity, currentUnit, selectedUnit).toFixed(2)} {selectedUnit}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConvert} className="flex-1">
            Convert & Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitConverter;
