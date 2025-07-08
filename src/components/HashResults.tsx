import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import type { HashResult } from '../types';
import { formatBytes, formatDuration } from '../utils/formatters';
import { copyToClipboard } from '../utils/clipboard';
import { Button } from './ui/Button';
import { Card, CardHeader, CardContent } from './ui/Card';

interface HashResultsProps {
  result: HashResult;
}

interface CopyState {
  [key: string]: boolean;
}

export function HashResults({ result }: HashResultsProps) {
  const [copyStates, setCopyStates] = useState<CopyState>({});
  const [showFullHashes, setShowFullHashes] = useState(false);

  const handleCopy = async (algorithm: string, hash: string) => {
    const success = await copyToClipboard(hash);
    
    if (success) {
      setCopyStates(prev => ({ ...prev, [algorithm]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [algorithm]: false }));
      }, 2000);
    }
  };

  const formatHash = (hash: string) => {
    if (showFullHashes) return hash;
    return `${hash.slice(0, 16)}...${hash.slice(-16)}`;
  };

  const hashAlgorithms = [
    { key: 'md5', label: 'MD5', value: result.md5 },
    { key: 'sha1', label: 'SHA-1', value: result.sha1 },
    { key: 'sha256', label: 'SHA-256', value: result.sha256 },
    { key: 'sha512', label: 'SHA-512', value: result.sha512 },
  ];

  return (
    <Card className="animate-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Hash Results
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullHashes(!showFullHashes)}
            className="text-xs"
          >
            {showFullHashes ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hide Full
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Show Full
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* File Info */}
        <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            File Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Name:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-gray-100 break-all">
                {result.name}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Size:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                {formatBytes(result.size)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Type:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                {result.type || 'Unknown'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Processing Time:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                {formatDuration(result.processingTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Hash Values */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Cryptographic Hashes
          </h3>
          
          {hashAlgorithms.map(({ key, label, value }) => (
            <div key={key} className="hash-item">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(key, value)}
                  className="p-1 h-auto"
                  title={`Copy ${label} hash`}
                >
                  {copyStates[key] ? (
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <code className="block text-xs font-mono text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-dark-700 p-2 rounded border break-all">
                {formatHash(value)}
              </code>
            </div>
          ))}
        </div>

        {/* Processing Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Processed on {new Date(result.processedAt).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}