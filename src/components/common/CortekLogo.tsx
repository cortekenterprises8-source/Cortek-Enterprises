import React from 'react';

interface CortekLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  showText?: boolean;
  theme?: 'light' | 'dark';
}

export const CortekLogo: React.FC<CortekLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  showText = true,
  theme = 'light',
}) => {
  const sizeMap = {
    sm: { main: 'text-[24px]', sub: 'text-[9px]' },
    md: { main: 'text-[34px]', sub: 'text-[11px]' },
    lg: { main: 'text-[50px]', sub: 'text-xs' },
    xl: { main: 'text-[64px]', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {showText && (
        <div className="flex flex-col items-start leading-none">
          <div
            className={`font-black uppercase tracking-[-0.02em] ${currentSize.main}`}
            style={{
              color: '#d97706',
              textShadow: '0 0 20px rgba(245, 158, 11, 0.8), 0 0 40px rgba(245, 158, 11, 0.5), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            CORTEK
          </div>
          <div
            className={`font-black uppercase tracking-[0.05em] ${currentSize.main}`}
            style={{
              color: '#d97706',
              textShadow: '0 0 20px rgba(245, 158, 11, 0.8), 0 0 40px rgba(245, 158, 11, 0.5), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
              lineHeight: 1.1,
              marginTop: '-0.04em',
              letterSpacing: '0.05em',
            }}
          >
            ENTERPRISES
          </div>
        </div>
      )}

      {showSubtitle && (
        <p className={`${currentSize.sub} ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium flex items-center gap-1.5 mt-2.5`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse" />
          <span className="text-slate-600 dark:text-slate-400">Direct Counter Stock</span>
          <span className="text-amber-500 font-bold">•</span>
          <span className="text-slate-600 dark:text-slate-400">4.9★</span>
        </p>
      )}
    </div>
  );
};
