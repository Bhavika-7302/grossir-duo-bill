
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface MobileBarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

const MobileBarcodeScanner = ({ isOpen, onClose, onBarcodeScanned }: MobileBarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for barcode scanning');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualEntry = () => {
    const barcode = prompt('మాన్యువల్‌గా బార్‌కోడ్ ఎంటర్ చేయండి / Enter barcode manually:');
    if (barcode) {
      onBarcodeScanned(barcode);
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            బార్‌కోడ్ స్కాన్ చేయండి / Scan Barcode
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isScanning ? (
            <div className="text-center space-y-4">
              <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                <Camera size={48} className="text-gray-400" />
              </div>
              <Button onClick={startCamera} className="w-full">
                కెమెరా ప్రారంభించండి / Start Camera
              </Button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-48 bg-black rounded-lg"
              />
              <div className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-24 border-2 border-red-500"></div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleManualEntry} className="flex-1">
              మాన్యువల్ ఎంట్రీ / Manual Entry
            </Button>
            {isScanning && (
              <Button variant="outline" onClick={stopCamera} className="flex-1">
                స్టాప్ / Stop
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileBarcodeScanner;
