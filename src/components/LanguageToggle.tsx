
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { isEnglish, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isEnglish ? '🇺🇸 English' : '🇮🇳 తెలుగు'}
    </Button>
  );
};

export default LanguageToggle;
