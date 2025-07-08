import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { formatBytes, formatFileType } from '../utils/formatters';
import { validateFile } from '../utils/validation';
import { Button } from './ui/Button';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
  className?: string;
}

export function FileDropZone({
  onFileSelect,
  selectedFile,
  disabled = false,
  className,
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length === 0) return;

    if (files.length > 1) {
      setError('Please select only one file at a time');
      return;
    }

    const file = files[0];
    const validation = validateFile(file);

    if (!validation.isValid) {
      setError(validation.errors[0] ?? 'Validation failed');
      return;
    }

    onFileSelect(file);
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files ?? null;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateFile(file);

    if (!validation.isValid) {
      setError(validation.errors[0] ?? 'Validation failed');
      return;
    }

    onFileSelect(file);
  }, [onFileSelect]);

  const handleRemoveFile = useCallback(() => {
    setError(null);
    // Reset file input
    const input = document.getElementById('file-input') as HTMLInputElement;
    if (input) input.value = '';
  }, []);

  const handleBrowseClick = useCallback(() => {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input?.click();
  }, []);

  if (selectedFile) {
    return (
      <div className={cn('card p-6 animate-in', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <File className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {selectedFile.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatBytes(selectedFile.size)} • {formatFileType(selectedFile.type)}
              </p>
            </div>
          </div>
          {!disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'drop-zone',
          isDragOver && 'dragover',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-300 dark:border-red-600'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? handleBrowseClick : undefined}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Drop your file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse
            </p>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            Choose File
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 animate-in">
          {error}
        </div>
      )}
    </div>
  );
}