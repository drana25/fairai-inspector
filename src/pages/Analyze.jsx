import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { analyzeBias, detectColumns } from '../services/biasEngine';
import { getExplanation } from '../services/gemini';
import { SAMPLE_CSV } from '../data/demoData';

const STEPS = ['Upload', 'Analyze', 'Report'];

const AI_MESSAGES = [
  "Parsing dataset...",
  "Detecting hidden bias...",
  "Analyzing fairness metrics...",
  "Generating AI insights..."
];

export default function Analyze({ user }) {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [csvText, setCsvText] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [detectedColumns, setDetectedColumns] = useState(null);

  // Rotate AI messages
  useEffect(() => {
    if (!analyzing) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % AI_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [analyzing]);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (!f) return;

    if (!f.name.endsWith('.csv')) {
      toast.error('Upload CSV only');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvText(text);
      setFile(f);
      setCurrentStep(1);

      const detected = detectColumns(text);
      setDetectedColumns(detected);
      setRowCount(text.split('\n').filter(row => row.trim()).length - 1);

      toast.success(`Loaded ${f.name}`);
    };
    reader.readAsText(f);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleSampleData = (e) => {
    e.stopPropagation(); // Prevent dropzone from opening
    setCsvText(SAMPLE_CSV);
    setFile({ name: 'sample_data.csv' });
    setCurrentStep(1);

    const detected = detectColumns(SAMPLE_CSV);
    setDetectedColumns(detected);
    setRowCount(SAMPLE_CSV.split('\n').filter(row => row.trim()).length - 1);

    toast.success('Sample loaded');
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setProgress(0);

    try {
      for (let i = 0; i <= 80; i += 10) {
        await sleep(200);
        setProgress(i);
      }

      const result = analyzeBias(
        csvText,
        detectedColumns.protectedColumns,
        detectedColumns.targetColumn
      );

      const explanations = {};
      for (const [col, metrics] of Object.entries(result.columns)) {
        explanations[col] = await getExplanation(col, metrics);
      }

      const analysisResult = {
        id: `aud-${Date.now()}`,
        datasetName: file.name,
        fairnessScore: result.fairnessScore,
        rowCount: result.rowCount,
        columns: result.columns,
        explanations,
        createdAt: new Date().toISOString()
      };

      // Save to history
      const history = JSON.parse(localStorage.getItem('fairai_history') || '[]');
      localStorage.setItem('fairai_history', JSON.stringify([analysisResult, ...history]));

      setProgress(100);
      setCurrentStep(2);

      navigate('/report', {
        state: {
          analysis: analysisResult
        }
      });

    } catch (err) {
      console.error(err);
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f] text-white">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b border-white/10 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="font-bold text-lg cursor-pointer" onClick={() => navigate('/dashboard')}>⚖️ FairAI</h1>
        <div className="flex items-center gap-3">
             <span className="text-sm text-gray-400">{user?.displayName || "Demo User"}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 md:p-10">

        {/* TITLE */}
        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-2">
              Analyze Dataset
            </h2>
            <p className="text-gray-400">
              Detect hidden biases in your AI training data before deployment.
            </p>
        </div>

        {/* STEPS */}
        <div className="flex justify-between items-center mb-12 relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -z-10" />
            {STEPS.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                    <motion.div
                        animate={{ 
                            scale: currentStep === i ? 1.1 : 1,
                            backgroundColor: i <= currentStep ? '#6366f1' : '#1f2937'
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${
                            i <= currentStep ? 'border-indigo-400' : 'border-gray-700'
                        }`}
                    >
                        {i + 1}
                    </motion.div>
                    <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-indigo-400' : 'text-gray-500'}`}>
                        {step}
                    </span>
                </div>
            ))}
        </div>

        {/* UPLOAD BOX */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl ${
              file 
              ? 'border-indigo-500/50 bg-indigo-500/5' 
              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <input {...getInputProps()} />

          {!file ? (
            <div className="space-y-4">
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-5xl"
              >
                📂
              </motion.div>
              <div>
                <p className="text-lg font-medium">Drag & drop your CSV file</p>
                <p className="text-gray-500 text-sm mt-1">Maximum file size: 50MB</p>
              </div>
              <button
                onClick={handleSampleData}
                className="px-6 py-2 rounded-full border border-indigo-400/30 text-indigo-400 hover:bg-indigo-500/10 transition text-sm font-medium"
              >
                Try with sample data
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto border border-green-500/30">
                <span className="text-3xl text-green-400">📊</span>
              </div>
              <div>
                 <p className="text-green-400 font-bold text-xl uppercase tracking-tight">{file.name}</p>
                 <p className="text-sm text-gray-400 mt-1">{rowCount.toLocaleString()} rows detected</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); setCurrentStep(0); }}
                className="text-gray-500 text-xs hover:text-red-400 transition"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* ANALYZE BUTTON */}
        {file && !analyzing && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
          >
            Run Fairness Audit
          </motion.button>
        )}

        {/* AI PROGRESS */}
        {analyzing && (
          <div className="mt-10 space-y-6">
            <div className="flex justify-between items-center px-2">
                <p className="text-indigo-300 font-medium animate-pulse">
                🚀 {AI_MESSAGES[messageIndex]}
                </p>
                <span className="text-gray-500 text-sm font-mono">{progress}%</span>
            </div>

            <div className="w-full bg-gray-800/50 h-3 rounded-full overflow-hidden p-[2px]">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <p className="text-center text-xs text-gray-500 italic">
               The AI fairness engine is crunching the numbers using the Geometric Mean method.
            </p>
          </div>
        )}

        {/* PRIVACY FOOTER */}
        <div className="mt-12 flex items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="text-xs">End-to-End Local Processing</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                <span className="text-xs">Aequitas Standard Metrics</span>
            </div>
        </div>

      </div>
    </div>
  );
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
