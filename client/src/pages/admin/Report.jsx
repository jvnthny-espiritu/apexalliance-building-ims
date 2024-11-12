import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import templateImage from '../../assets/img/BatStateU Template.png';

const Reports = ({ data = [] }) => {
  const [formattedDate, setFormattedDate] = useState('');

  // current date
  useEffect(() => {
    const currentDate = new Date();
    const formatted = currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setFormattedDate(formatted);
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 72; // equivalent to 1 inch margin

    // Define colors from Tailwind configuration
    const primaryColor = "#FF0000";       // Tailwind 'primary'
    const primaryLight = "#ff2222";       // Tailwind 'primary-light'
    const darkGray = "#808080";     

    // Add the template image
    doc.addImage(templateImage, 'PNG', 0, 0, 210, 297);

    // Add dynamic content with font size adjustments
    doc.setFont('times');
    doc.setFontSize(12); 
    doc.text(formattedDate, 25, 56);  
    doc.text("Batangas State University - The National Engineering University, Alangilan Campus", 25, 61);

    // Center 
    const titleText = "STATUS REPORT OF AIR CONDITIONING UNITS";
    const titleXPos = (doc.internal.pageSize.width - doc.getTextWidth(titleText)) / 2;
    doc.setFont('times', 'bold');
    doc.setFontSize(12); // Set font size for title
    doc.text(titleText, titleXPos, margin);

    //Center the table
    doc.autoTable({
      startY: margin + 3, //add 3 para sa margin below the title
      margin: { horizontal: 25 },
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
        fontSize: 12,    
        font: "Times New Roman",        
      },
      bodyStyles: {
        textColor: darkGray,      // Dark gray text in body
        fontSize: 10,  
        font: "Times New Roman",          
      },
      alternateRowStyles: {
        fillColor: "#F5F5F5",     // Light gray background for alternate rows
      },
    });
    
    doc.output('dataurlnewwindow')  // Open in new tab
    //doc.save('Report.pdf');  //save
  };

  return (
    <div className="container mx-auto my-16 p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Status Report of Air Conditioning Units</h1>
            <p className="text-sm">{formattedDate}</p>  {/* Display the current date */}
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
}

export default Reports;
