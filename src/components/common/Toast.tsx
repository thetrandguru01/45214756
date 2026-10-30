import React from 'react';
import { useApp } from '../../lib/store';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-300 bg-emerald-50/95 text-emerald-900',
    error: 'border-rose-300 bg-rose-50/95 text-rose-900',
    info: 'border-blue-300 bg-blue-50/95 text-blue-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in shadow-2xl">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${
          borders[toastMessage.type]
        }`}
      >
        {icons[toastMessage.type]}
        <div className="text-sm font-medium leading-snug">{toastMessage.text}</div>
      </div>
    </div>
  );
};
