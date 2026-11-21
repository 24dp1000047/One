import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ToastContainer: React.FC = () => {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const getIcon = () => {
            switch (toast.type) {
              case 'success':
                return <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0" />;
              case 'warning':
                return <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0" />;
              case 'error':
                return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
              default:
                return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
            }
          };

          const getBorder = () => {
            switch (toast.type) {
              case 'success':
                return 'border-brand-yellow/30';
              case 'warning':
                return 'border-brand-orange/30';
              case 'error':
                return 'border-rose-500/30';
              default:
                return 'border-sky-400/30';
            }
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-[#141414]/95 backdrop-blur-xl border ${getBorder()} shadow-2xl text-sm`}
            >
              {getIcon()}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-xs sm:text-sm tracking-wide">{toast.title}</h4>
                {toast.message && (
                  <p className="text-muted text-xs mt-0.5 line-clamp-2">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
