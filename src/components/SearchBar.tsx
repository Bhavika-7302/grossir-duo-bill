
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Barcode, Mic, MicOff } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  unit: 'kg' | 'grams' | 'liters' | 'ml' | 'pieces';
}

interface SearchBarProps {
  products: Product[];
  onProductSelect: (product: Product, quantity?: number) => void;
  onBarcodeSearch: (barcode: string) => void;
}

const SearchBar = ({ products, onProductSelect, onBarcodeSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  const handleVoiceCommand = (command: string) => {
    // Parse voice commands like "add 2 kg milk" or "add milk"
    const words = command.split(' ');
    let quantity = 1;
    let unit = 'pieces';
    let productName = '';

    // Extract quantity and unit
    if (words.length > 1) {
      const numberMatch = words.find(word => !isNaN(parseFloat(word)));
      if (numberMatch) {
        quantity = parseFloat(numberMatch);
        const numberIndex = words.indexOf(numberMatch);
        
        // Check for unit after number
        if (numberIndex + 1 < words.length) {
          const potentialUnit = words[numberIndex + 1];
          if (['kg', 'grams', 'liters', 'ml', 'pieces'].includes(potentialUnit)) {
            unit = potentialUnit as any;
          }
        }
        
        // Get product name (remaining words)
        productName = words.filter(word => 
          word !== numberMatch && 
          !['kg', 'grams', 'liters', 'ml', 'pieces', 'add'].includes(word)
        ).join(' ');
      } else {
        productName = words.filter(word => word !== 'add').join(' ');
      }
    }

    // Find matching product
    const matchingProduct = products.find(product =>
      product.name.toLowerCase().includes(productName.toLowerCase())
    );

    if (matchingProduct) {
      onProductSelect(matchingProduct, quantity);
      setSearchTerm('');
    } else {
      // Show search results for the voice command
      setSearchTerm(productName);
    }
  };

  const startVoiceRecognition = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleBarcodeInput = (value: string) => {
    setSearchTerm(value);
    // If it looks like a barcode (numbers), trigger barcode search
    if (/^\d+$/.test(value) && value.length >= 8) {
      onBarcodeSearch(value);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search items or scan barcode..."
            value={searchTerm}
            onChange={(e) => handleBarcodeInput(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            // Simulate barcode scanner input
            const barcode = prompt('Enter barcode:');
            if (barcode) {
              handleBarcodeInput(barcode);
            }
          }}
        >
          <Barcode size={18} />
        </Button>

        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
          disabled={!recognition}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <div
              key={product.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => {
                onProductSelect(product);
                setSearchTerm('');
                setShowSuggestions(false);
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">
                    ${product.price.toFixed(2)} per {product.unit} • Stock: {product.stock}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
            </div>
          ))}
        </Card>
      )}

      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50">
          <Card className="p-3 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 text-red-600">
              <Mic size={16} className="animate-pulse" />
              <span className="text-sm">Listening... Say "add [quantity] [unit] [item name]"</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
