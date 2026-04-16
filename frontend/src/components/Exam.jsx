import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronRight, Send, Clock, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Exam = ({ user, onSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Timer state (180 minutes)
  const [timeLeft, setTimeLeft] = useState(180 * 60);

  // Refs to avoid stale closures in event listeners
  const answersRef = useRef(answers);
  const submittingRef = useRef(submitting);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    answersRef.current = answers;
    submittingRef.current = submitting;
    timeLeftRef.current = timeLeft;
  }, [answers, submitting, timeLeft]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/questions`);
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  // Timer logic
  useEffect(() => {
    if (loading) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [loading]);

  // Tab switch logic
  useEffect(() => {
    if (loading) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !submittingRef.current) {
        alert("Warning: Tab switch detected! Your exam is being submitted automatically.");
        handleAutoSubmit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [loading]);

  // Handle navigating away or closing tab
  useEffect(() => {
    if (loading) return;

    const performBeaconSubmit = () => {
      if (!submittingRef.current) {
        submittingRef.current = true;
        const formattedAnswers = Object.entries(answersRef.current).map(([qId, oIndex]) => ({
          questionId: qId,
          selectedOptionIndex: oIndex
        }));
        
        const timeTakenSeconds = (180 * 60) - timeLeftRef.current;
        const blob = new Blob([JSON.stringify({ userId: user._id, answers: formattedAnswers, timeTakenSeconds })], { type: 'application/json' });
        navigator.sendBeacon(`${API_URL}/api/submit`, blob);
      }
    };

    const handleBeforeUnload = () => {
      performBeaconSubmit();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      performBeaconSubmit(); // Triggered on component unmount
    };
  }, [loading, user._id]);

  const handleAutoSubmit = async () => {
    if (submittingRef.current) return;
    
    setSubmitting(true);
    submittingRef.current = true;

    const formattedAnswers = Object.entries(answersRef.current).map(([qId, oIndex]) => ({
      questionId: qId,
      selectedOptionIndex: oIndex
    }));
    
    const timeTakenSeconds = (180 * 60) - timeLeftRef.current;

    try {
      const response = await axios.post(`${API_URL}/api/submit`, {
        userId: user._id,
        answers: formattedAnswers,
        timeTakenSeconds
      });
      onSubmit(response.data.score, response.data.total, response.data.detailedResults);
    } catch (error) {
      console.error('Failed to submit exam:', error);
      alert('Error submitting exam automatically.');
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
  };

  if (loading) return <div className="card title" style={{background: 'none'}}>Loading Exam...</div>;
  if (!questions.length) return <div className="card title">No questions available.</div>;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="card" style={{ maxWidth: '800px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '12px' }}>
        <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600' }}>
          Candidate: {user.userId}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 300 ? 'var(--error)' : 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <Clock size={24} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <span>Question {currentIndex + 1} of {questions.length}</span>
      </div>

      <div className="question-container">
        <h2 className="question-text">{currentQuestion.questionText}</h2>
        
        <div className="options-list">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${answers[currentQuestion._id] === idx ? 'selected' : ''}`}
              onClick={() => handleSelectOption(currentQuestion._id, idx)}
            >
              <div className="option-indicator">
                 {answers[currentQuestion._id] === idx && <div style={{width:'10px', height:'10px', background:'white', borderRadius:'50%'}}></div>}
              </div>
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        {currentIndex < questions.length - 1 ? (
          <button 
            className="btn" 
            style={{ width: 'auto' }} 
            onClick={handleNext}
          >
            Next Question <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            className="btn" 
            style={{ width: 'auto', background: 'var(--success)' }} 
            onClick={handleAutoSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Exam'} <Send size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Exam;
