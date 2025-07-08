import React from 'react';
import { cn } from '../../utils/cn';
import { formatPercentage } from '../../utils/formatters';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function Progress({
  value,
  max = 100,
  className,
  showLabel = true,
  label,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {label || 'Progress'}
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {formatPercentage(percentage)}
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
        <div
          className="progress-bar h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}