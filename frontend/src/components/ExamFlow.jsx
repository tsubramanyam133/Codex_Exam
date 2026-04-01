import { useState } from 'react';
import Login from './Login';
import Exam from './Exam';
import ThankYou from './ThankYou';

const ExamFlow = () => {
  const [user, setUser] = useState(null);
  const [examResult, setExamResult] = useState(null);

  const handleExamSubmit = (score, total) => {
    setExamResult({ score, total });
  };

  return (
    <div className="app-container">
      {!user ? (
        <Login onLogin={setUser} />
      ) : !examResult ? (
        <Exam user={user} onSubmit={handleExamSubmit} />
      ) : (
        <ThankYou />
      )}
    </div>
  );
}

export default ExamFlow;
