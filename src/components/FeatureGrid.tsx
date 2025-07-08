import React from 'react';
import { Shield, Zap, Lock, Globe } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Processing',
    description: 'All hashing is performed locally in your browser. Your files never leave your device.',
  },
  {
    icon: Zap,
    title: 'Fast & Efficient',
    description: 'Optimized algorithms with streaming support for files of any size.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Zero data collection. No tracking. Complete privacy guaranteed.',
  },
  {
    icon: Globe,
    title: 'Universal Support',
    description: 'Works with any file type. MD5, SHA-1, SHA-256, and SHA-512 algorithms.',
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className="card p-6 hover:shadow-md transition-shadow duration-200 animate-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <feature.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}