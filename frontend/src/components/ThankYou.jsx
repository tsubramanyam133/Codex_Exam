import { CheckCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ThankYou = ({ examResult }) => {
  const handleDownloadPDF = () => {
    if (!examResult || !examResult.detailedResults) {
      alert("Results details not available.");
      return;
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Exam Results Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Score: ${examResult.score} / ${examResult.total}`, 14, 32);

    const tableColumn = ["Question", "Your Answer", "Correct Answer", "Result"];
    const tableRows = [];

    examResult.detailedResults.forEach(item => {
      // Clean up text if it contains line breaks
      const safeText = (text) => text ? text.replace(/\n/g, ' ') : '';
      
      const rowData = [
        safeText(item.questionText),
        safeText(item.selectedOption),
        safeText(item.correctOption),
        item.isCorrect ? "Correct" : "Incorrect"
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 }
      }
    });

    doc.save('exam_results.pdf');
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem auto' }} />
      <h1 className="title" style={{ marginBottom: '1rem' }}>Thank You for Attending!</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
        Your answers have been successfully submitted and recorded.
      </p>

      {examResult && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
            Your Score: {examResult.score} / {examResult.total}
          </p>
          <button onClick={handleDownloadPDF} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '250px' }}>
            <Download size={20} /> Download Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ThankYou;
