
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import AdminDashboard from '@/components/AdminDashboard';
import SalesScreen from '@/components/SalesScreen';

const Index = () => {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<{ role: 'admin' | 'user' | null; name: string }>({ role: null, name: '' });
  const [pin, setPin] = useState('');
  const [userType, setUserType] = useState<'admin' | 'user' | null>(null);
  const [error, setError] = useState('');

  // Demo credentials
  const adminPin = '123456';
  const userPin = '1234';

  const handleLogin = () => {
    setError('');
    
    if (userType === 'admin' && pin === adminPin) {
      setCurrentUser({ role: 'admin', name: 'Admin User' });
    } else if (userType === 'user' && pin === userPin) {
      setCurrentUser({ role: 'user', name: 'Sales Staff' });
    } else {
      setError(t('తప్పుడు పిన్. దయచేసి మళ్లీ ప్రయత్నించండి.', 'Invalid PIN. Please try again.'));
      setPin('');
    }
  };

  const handleLogout = () => {
    setCurrentUser({ role: null, name: '' });
    setPin('');
    setUserType(null);
    setError('');
  };

  const handlePinInput = (value: string) => {
    const maxLength = userType === 'admin' ? 6 : 4;
    if (value.length <= maxLength && /^\d*$/.test(value)) {
      setPin(value);
      setError('');
    }
  };

  if (currentUser.role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white shadow-md border-b-2 border-blue-500">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">Grossir POS</h1>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <span className="text-gray-600">
                {t('స్వాగతం', 'Welcome')}, {currentUser.name}
              </span>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                {t('లాగ్ అవుట్', 'Logout')}
              </Button>
            </div>
          </div>
        </header>
        
        {currentUser.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <SalesScreen />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center mb-2">
            <div></div>
            <LanguageToggle />
          </div>
          <CardTitle className="text-3xl font-bold">Grossir POS</CardTitle>
          <p className="text-blue-100">{t('లాగిన్ రకం ఎంచుకోండి', 'Select Login Type')}</p>
        </CardHeader>
        <CardContent className="p-8">
          {!userType ? (
            <div className="space-y-4">
              <Button
                onClick={() => setUserType('admin')}
                className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              >
                {t('అడ్మిన్ లాగిన్', 'Admin Login')}
                <span className="block text-sm text-blue-200">
                  {t('6-అంకెల పిన్', '6-digit PIN')}
                </span>
              </Button>
              <Button
                onClick={() => setUserType('user')}
                className="w-full h-16 text-lg bg-green-600 hover:bg-green-700 transition-all duration-200"
              >
                {t('యూజర్ లాగిన్', 'User Login')}
                <span className="block text-sm text-green-200">
                  {t('4-అంకెల పిన్', '4-digit PIN')}
                </span>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {userType === 'admin' ? t('అడ్మిన్ లాగిన్', 'Admin Login') : t('యూజర్ లాగిన్', 'User Login')}
                </h3>
                <p className="text-gray-600">
                  {t(`మీ ${userType === 'admin' ? '6' : '4'}-అంకెల పిన్ ఎంటర్ చేయండి`, `Enter your ${userType === 'admin' ? '6' : '4'}-digit PIN`)}
                </p>
              </div>
              
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder={t(`${userType === 'admin' ? '6' : '4'}-అంకెల పిన్ ఎంటర్ చేయండి`, `Enter ${userType === 'admin' ? '6' : '4'}-digit PIN`)}
                  value={pin}
                  onChange={(e) => handlePinInput(e.target.value)}
                  className="text-center text-xl tracking-widest h-14"
                  maxLength={userType === 'admin' ? 6 : 4}
                />
                
                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setUserType(null);
                      setPin('');
                      setError('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('వెనుకకు', 'Back')}
                  </Button>
                  <Button
                    onClick={handleLogin}
                    disabled={pin.length !== (userType === 'admin' ? 6 : 4)}
                    className={`flex-1 ${userType === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {t('లాగిన్', 'Login')}
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center border-t pt-4">
                {t('డెమో: అడ్మిన్ పిన్: 123456 | యూజర్ పిన్: 1234', 'Demo: Admin PIN: 123456 | User PIN: 1234')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
