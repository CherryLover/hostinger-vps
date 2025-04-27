import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        // 根据类型选择图标和颜色
        let bgColor = 'bg-neutral-700';
        let Icon = Info;
        
        if (toast.type === 'success') {
          bgColor = 'bg-success-500';
          Icon = CheckCircle;
        } else if (toast.type === 'error') {
          bgColor = 'bg-danger-500';
          Icon = AlertCircle;
        }
        
        return (
          <div
            key={toast.id}
            className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center min-w-[240px] max-w-xs animate-fade-in`}
            style={{
              animation: 'fadeIn 0.3s, fadeOut 0.3s 2.7s'
            }}
          >
            <Icon size={18} className="mr-2" />
            <span className="flex-1">{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-2 p-1 hover:bg-white/20 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer; 