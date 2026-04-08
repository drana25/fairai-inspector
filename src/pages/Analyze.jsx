import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { analyzeBias, detectColumns } from '../services/biasEngine';
import { getExplanation } from '../services/gemini';
import { SAMPLE_CSV } from '../data/demoData';

const STEPS = [
  { label: 'Upload', icon: '📄' },
  { label: 'Analyze', icon: '🔬' },
  { label: 'Report', icon: '📊' },
];

export default function Analyze({ user }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [csvText, setCsvText] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [progressLabel, setProgressLabel] = useState('');
  const [detectedColumns, setDetectedColumns] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (!f) return;

    if (!f.name.endsWith('.csv') && f.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvText(text);
      setFile(f);
      setCurrentStep(1);

      // Auto-detect columns
      const detected = detectColumns(text);
      setDetectedColumns(detected);
      setRowCount(text.split('\n').filter((l) => l.trim()).length - 1);
      toast.success(`Loaded ${f.name}`);
    };
    reader.readAsText(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleSampleData = () => {
    setCsvText(SAMPLE_CSV);
    setFile({ name: 'sample_hiring_data.csv' });
    setCurrentStep(1);
    const detected = detectColumns(SAMPLE_CSV);
    setDetectedColumns(detected);
    setRowCount(SAMPLE_CSV.split('\n').filter((l) => l.trim()).length - 1);
    toast.success('Sample dataset loaded!');
  };

  const handleAnalyze = async () => {
    if (!csvText || !detectedColumns) {
      toast.error('Please upload a CSV file first');
      return;
    }

    setAnalyzing(true);
    setCurrentStep(1);

    try {
      // Step 1: Parsing
      setProgressLabel('Parsing CSV data...');
      await sleep(500);

      // Step 2: Calculating bias metrics
      setProgressLabel('Calculating bias metrics...');
      await sleep(300);
      const result = analyzeBias(
        csvText,
        detectedColumns.protectedColumns,
        detectedColumns.targetColumn
      );

      // Step 3: Generating explanations
      setProgressLabel('Generating AI explanations...');
      const explanations = {};
      for (const [colName, metrics] of Object.entries(result.columns)) {
        explanations[colName] = await getExplanation(colName, metrics);
      }

      setCurrentStep(2);
      setProgressLabel('');

      // Navigate to report with results
      navigate('/report', {
        state: {
          analysis: {
            datasetName: file?.name || 'Dataset',
            fairnessScore: result.fairnessScore,
            rowCount: result.rowCount,
            columns: result.columns,
            explanations,
            createdAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a0f]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">⚖️</span>
            <span className="font-bold text-white">Fair<span className="text-indigo-400">AI</span></span>
          </button>
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-gray-700" />
            )}
            <span className="text-gray-400 text-sm hidden sm:block">
              {user?.displayName || 'Demo User'}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Analyze Dataset</h1>
            <p className="text-gray-400">Upload your CSV file to detect bias in AI training data</p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    i <= currentStep
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gray-800/30 text-gray-600 border border-gray-800/30'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px mx-1 ${i < currentStep ? 'bg-indigo-500/50' : 'bg-gray-800'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Upload area */}
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-600/5 shadow-lg shadow-indigo-500/10'
                : file
                ? 'border-green-500/30 bg-green-600/5'
                : 'border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-600/5'
            }`}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file-info"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-600/10 border border-green-500/20 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">{rowCount.toLocaleString()} rows detected</p>
                  {detectedColumns && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                      {detectedColumns.protectedColumns.map((col) => (
                        <span key={col} className="px-2.5 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs">
                          {col}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 bg-amber-600/10 border border-amber-500/20 rounded-full text-amber-400 text-xs">
                        target: {detectedColumns.targetColumn}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Drop another file to replace</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                    <span className="text-2xl">📁</span>
                  </div>
                  <p className="text-white font-medium">
                    {isDragActive ? 'Drop your CSV here...' : 'Drag & drop your CSV file here'}
                  </p>
                  <p className="text-gray-500 text-sm">or click to browse</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sample data button */}
          {!file && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-4"
            >
              <button
                onClick={handleSampleData}
                className="text-indigo-400 text-sm hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-500/60 transition-all"
              >
                🧪 Try with sample hiring data
              </button>
            </motion.div>
          )}

          {/* Analyze button */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
              >
                {analyzing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{progressLabel}</span>
                  </div>
                ) : (
                  '🔬 Analyze Bias'
                )}
              </button>
            </motion.div>
          )}

          {/* Privacy notice */}
          <div className="mt-8 p-4 bg-[#12121a]/50 border border-gray-800/30 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-gray-300 text-sm font-medium">Your data stays private</p>
                <p className="text-gray-500 text-xs mt-1">
                  Your CSV is analysed entirely in your browser and never stored on our servers.
                  Only aggregated statistics are sent to the AI for explanation generation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
