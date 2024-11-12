import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import templateImage from '../../assets/img/BatStateU Template.png';


const Reports = ({ data = [] }) => {
  // Function to generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Define colors from Tailwind configuration
    const primaryColor = "#FF0000";       // Tailwind 'primary'
    const primaryLight = "#ff2222";       // Tailwind 'primary-light'
    const darkGray = "#808080";           // Tailwind 'darkGray'
  
    // Add the template image (make sure the path is correct)
    doc.addImage(templateImage, 'PNG', 0, 0, 210, 297);

  
    // Add dynamic content
    doc.setTextColor(primaryColor);
    doc.text("Status Report of Air Conditioning Units", 14, 10);
    doc.text("October 17, 2023", 14, 16);
    doc.text("Batangas State University - The National Engineering University, Alangilan Campus", 14, 22);
  
    // Use the primaryLight color for the table header background and white text color
    doc.autoTable({
      startY: 30,
      head: [['Building', 'Room', 'Units', 'Report', 'Status']],
      body: data.map(item => [
        item.building,
        item.room,
        item.units,
        item.report,
        item.status,
      ]),
      headStyles: {
        fillColor: primaryLight,  // Using primary-light as header background
        textColor: "#ffffff",     // White text
      },
      bodyStyles: {
        textColor: darkGray,      // Dark gray text in body
      },
      alternateRowStyles: {
        fillColor: "#F5F5F5"      // Light gray background for alternate rows
      },
    });
  
    // Open PDF in a new tab
    doc.output('dataurlnewwindow');
  };
  
  
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Status Report of Air Conditioning Units</h1>
            <p className="text-sm">October 17, 2023</p>
            <p className="text-sm">Batangas State University - The National Engineering University, Alangilan Campus</p>
          </div>
          <button
            onClick={downloadPDF} // Make sure this calls downloadPDF correctly
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View PDF
          </button>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Building</th>
              <th className="py-2 px-4 border-b text-left">Room</th>
              <th className="py-2 px-4 border-b text-left">Units</th>
              <th className="py-2 px-4 border-b text-left">Report</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{item.building}</td>
                  <td className="py-2 px-4 border-b">{item.room}</td>
                  <td className="py-2 px-4 border-b">{item.units}</td>
                  <td className="py-2 px-4 border-b">{item.report}</td>
                  <td className="py-2 px-4 border-b">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
