export const testJSPDF = () => {
    try {
        console.log("Loading jspdf");
        const jsPDF = require('jspdf').jsPDF;
        console.log(jsPDF);
    } catch(e) {
        console.error(e);
    }
}
