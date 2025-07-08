import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { ProcessingState, ProcessingProgress } from '../types';
import { formatBytes, formatSpeed, formatDuration } from '../utils/formatters';
import { Progress } from './ui/Progress';
import { Card, CardContent } from './ui/Card';

interface ProcessingStatusProps {
  state: ProcessingState;
  progress: ProcessingProgress | null;
  error: string | null;
}

export function ProcessingStatus({ state, progress, error }: ProcessingStatusProps) {
  if (state === 'idle') return null;

  return (
    <Card className="animate-in">
      <CardContent>
        <div className="space-y-4">
          {/* Status Header */}
          <div className="flex items-center space-x-3">
            {state === 'processing' && (
              <>
                <Loader2 className="h-5 w-5 text-primary-600 dark:text-primary-400 animate-spin" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Processing file...
                </span>
              </>
            )}
            
            {state === 'completed' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Processing completed
                </span>
              </>
            )}
            
            {state === 'error' && (
              <>
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-900 dark:text-red-100">
                  Processing failed
                </span>
              </>
            )}
          </div>

          {/* Progress Bar */}
          {progress && (
            <Progress
              value={progress.percentage}
              label="Progress"
              className="animate-in"
            />
          )}

          {/* Processing Stats */}
          {progress && state === 'processing' && (
            <div className="grid grid-cols-2 gap-4 text-sm animate-in">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Speed:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                  {formatSpeed(progress.speed)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                  {formatDuration(progress.estimatedTimeRemaining)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Processed:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                  {formatBytes(progress.bytesProcessed)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                  {formatBytes(progress.totalBytes)}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg animate-in">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}