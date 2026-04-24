import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
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
      setRowCount(text.split('\n').length - 1);

      toast.success(`Loaded ${f.name}`);
    };
    reader.readAsText(f);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleSampleData = () => {
    setCsvText(SAMPLE_CSV);
    setFile({ name: 'sample_data.csv' });
    setCurrentStep(1);

    const detected = detectColumns(SAMPLE_CSV);
    setDetectedColumns(detected);
    setRowCount(SAMPLE_CSV.split('\n').length - 1);

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

      setProgress(100);
      setCurrentStep(2);

      navigate('/report', {
        state: {
          analysis: {
            datasetName: file.name,
            fairnessScore: result.fairnessScore,
            rowCount: result.rowCount,
            columns: result.columns,
            explanations
          }
        }
      });

    } catch (err) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111827] to-[#0a0a0f] text-white">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b border-white/10 backdrop-blur-lg">
        <h1 className="font-bold text-lg">⚖️ FairAI</h1>
        <span className="text-sm text-gray-400">{user?.displayName || "User"}</span>
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Analyze Dataset
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Detect bias in AI training data
        </p>

        {/* STEPS */}
        <div className="flex justify-between mb-10">
          {STEPS.map((step, i) => (
            <div key={i} className="flex-1 text-center">
              <motion.div
                animate={{ scale: currentStep === i ? 1.1 : 1 }}
                className={`p-3 rounded-full border ${
                  i <= currentStep
                    ? 'bg-indigo-500/20 border-indigo-400 shadow-lg'
                    : 'border-gray-700'
                }`}
              >
                {step}
              </motion.div>
            </div>
          ))}
        </div>

        {/* UPLOAD BOX */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer backdrop-blur-xl bg-white/5 hover:bg-white/10 transition"
        >
          <input {...getInputProps()} />

          {!file ? (
            <>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                📂
              </motion.div>
              <p>Drag & drop CSV here</p>
              <button
                onClick={handleSampleData}
                className="mt-3 text-indigo-400 underline"
              >
                Try sample
              </button>
            </>
          ) : (
            <>
              <p className="text-green-400">✅ {file.name}</p>
              <p className="text-sm text-gray-400">{rowCount} rows</p>
            </>
          )}
        </div>

        {/* ANALYZE BUTTON */}
        {file && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold"
          >
            {analyzing ? "Analyzing..." : "Analyze Bias"}
          </motion.button>
        )}

        {/* AI PROGRESS */}
        {analyzing && (
          <div className="mt-6">
            <p className="text-center text-gray-300 mb-2">
              {AI_MESSAGES[messageIndex]}
            </p>

            <div className="w-full bg-gray-800 h-2 rounded-full">
              <motion.div
                className="h-2 bg-indigo-500 rounded-full"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* PRIVACY */}
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-sm text-gray-300">🔒 Your data stays private</p>
          <p className="text-xs text-gray-500">
            Processed locally. Only insights sent to AI.
          </p>
        </div>

      </div>
    </div>
  );
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}