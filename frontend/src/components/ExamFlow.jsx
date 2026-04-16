import { useState } from 'react';
import Login from './Login';
import Exam from './Exam';
import ThankYou from './ThankYou';

const ExamFlow = () => {
  const [user, setUser] = useState(null);
  const [examResult, setExamResult] = useState(null);

  const handleExamSubmit = (score, total, detailedResults) => {
    setExamResult({ score, total, detailedResults });
  };

  return (
    <div className="app-container">
      {!user ? (
        <Login onLogin={setUser} />
      ) : !examResult ? (
        <Exam user={user} onSubmit={handleExamSubmit} />
      ) : (
        <ThankYou examResult={examResult} />
      )}
    </div>
  );
}

export default ExamFlow;
