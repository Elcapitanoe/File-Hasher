import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileDropZone } from './components/FileDropZone';
import { ProcessingStatus } from './components/ProcessingStatus';
import { HashResults } from './components/HashResults';
import { FeatureGrid } from './components/FeatureGrid';
import { Button } from './components/ui/Button';
import { useFileProcessor } from './hooks/useFileProcessor';
import './styles/globals.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    processingState,
    progress,
    result,
    error,
    processFile,
    reset,
  } = useFileProcessor();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    reset(); // Clear any previous results
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    await processFile(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    reset();
  };

  const isProcessing = processingState === 'processing';
  const hasResult = processingState === 'completed' && result;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Secure File Hash Generator
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Generate cryptographic hashes for your files with complete privacy. 
              All processing happens locally in your browser.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* File Selection */}
            <FileDropZone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              disabled={isProcessing}
              className="animate-in"
            />

            {/* Process Button */}
            {selectedFile && !hasResult && (
              <div className="flex justify-center animate-in">
                <Button
                  onClick={() => { void handleProcess(); }}
                  loading={isProcessing}
                  disabled={!selectedFile || isProcessing}
                  size="lg"
                  className="px-8"
                >
                  {isProcessing ? 'Processing...' : 'Generate Hashes'}
                </Button>
              </div>
            )}

            {/* Processing Status */}
            <ProcessingStatus
              state={processingState}
              progress={progress}
              error={error}
            />

            {/* Results */}
            {hasResult && (
              <div className="space-y-6">
                <HashResults result={result} />
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleReset}
                    variant="secondary"
                    size="lg"
                  >
                    Process Another File
                  </Button>
                </div>
              </div>
            )}

            {/* Features Grid */}
            {!selectedFile && <FeatureGrid />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;