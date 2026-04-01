import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExamFlow from './components/ExamFlow';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExamFlow />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
