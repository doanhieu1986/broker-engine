import { ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: number;
  bgColor?: string;
  variant?: 'primary' | 'accent' | 'success' | 'warning';
  projectedValue?: string | number;
  projectedNumericValue?: number;
  currentNumericValue?: number;
  planCompletion?: number;
  amountMissing?: string | number;
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  bgColor,
  variant = 'primary',
  projectedValue,
  projectedNumericValue,
  currentNumericValue,
  planCompletion,
  amountMissing,
}: StatCardProps) {
  const isTrendPositive = trend && trend > 0;

  const variantStyles = {
    primary: 'from-primary-500 to-primary-700',
    accent: 'from-accent-500 to-accent-700',
    success: 'from-green-500 to-green-700',
    warning: 'from-amber-500 to-amber-700',
  };

  const iconBgStyles = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };

  const projectedIconColors = {
    primary: 'text-primary-600 dark:text-primary-400',
    accent: 'text-accent-600 dark:text-accent-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Background gradient accent */}
      <div className={`absolute top-0 right-0 -z-10 w-40 h-40 bg-gradient-to-br ${variantStyles[variant]} opacity-5 rounded-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity`}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              {title}
            </p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
                </p>
                {unit && <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{unit}</span>}
              </div>
              {projectedValue !== undefined && (
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className={projectedIconColors[variant]} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Dự đoán:</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {typeof projectedValue === 'number' ? projectedValue.toLocaleString('vi-VN') : projectedValue}
                  </span>
                  {(
                    (typeof value === 'number' && typeof projectedValue === 'number') ||
                    (projectedNumericValue !== undefined && currentNumericValue !== undefined)
                  ) && (
                    (() => {
                      const current = currentNumericValue ?? (typeof value === 'number' ? value : 0);
                      const projected = projectedNumericValue ?? (typeof projectedValue === 'number' ? projectedValue : 0);
                      const diff = projected - current;
                      const isPositive = diff >= 0;
                      return (
                        <span className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <span>(</span>
                          {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          <span>{Math.abs(diff).toLocaleString('vi-VN')})</span>
                        </span>
                      );
                    })()
                  )}
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className={`${bgColor || iconBgStyles[variant]} p-3 rounded-lg`}>
              {icon}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {trend !== undefined && (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${
                isTrendPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {isTrendPositive ? (
                  <ArrowUp size={16} className="font-bold" />
                ) : (
                  <ArrowDown size={16} className="font-bold" />
                )}
                <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">so với tháng trước</span>
            </div>
          )}
          {planCompletion !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Hoàn thành kế hoạch:</span>
                <span className={`text-sm font-semibold ${planCompletion >= 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(typeof planCompletion === 'number' ? planCompletion : 0).toFixed(2)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${planCompletion >= 100 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(planCompletion, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          {amountMissing !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Còn thiếu:</span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {typeof amountMissing === 'number' ? amountMissing.toLocaleString('vi-VN') : amountMissing}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
