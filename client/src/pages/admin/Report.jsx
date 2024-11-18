import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import templateImage from '../../assets/img/BatStateU Template.png';
import Filter, { Filtermobile } from '../../components/Filter'; 

const Reports = ({ data = [] }) => {
  const [formattedDate, setFormattedDate] = useState('');
  const [filters, setFilters] = useState({
    building: 'All Buildings', // Default filter is 'all' for buildings
  });

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

  // Filter the reports data based on selected filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesBuilding = filters.building === 'All Buildings' || item.building === filters.building;
      return matchesBuilding;
    });
  }, [data, filters]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 72;

    const primaryColor = "#FF0000"; 
    const primaryLight = "#ff2222";       
    const darkGray = "#808080";      

    doc.addImage(templateImage, 'PNG', 0, 0, 210, 297);
    doc.setFont('times');
    doc.setFontSize(12); 
    doc.text(formattedDate, 25, 56);  
    doc.text("Batangas State University - The National Engineering University, Alangilan Campus", 25, 61);

    const titleText = "STATUS REPORT";
    const titleXPos = (doc.internal.pageSize.width - doc.getTextWidth(titleText)) / 2;
    doc.setFont('times', 'bold');
    doc.setFontSize(12); 
    doc.text(titleText, titleXPos, margin);

    doc.autoTable({
      startY: margin + 3, //add 3 para sa margin below the title
      margin: { horizontal: 25 },
      head: [['Building', 'Room', 'Units', 'Report', 'Status']],
      body: filteredData.map(item => [
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

    doc.output('dataurlnewwindow');
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <div className="container mx-auto my-16 p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Status Report</h1>
            <p className="text-sm">{formattedDate}</p>  
            <p className="text-sm">Batangas State University - The National Engineering University, Alangilan Campus</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Filters Section */}
            <div className="flex gap-4">
              <div className="w-32">
                <Filter
                  options={['Building 1', 'Building 2', 'Building 3'].map(building => [building, building])}
                  selectedValue={filters.building}
                  onChange={(value) => handleFilterChange('building', value)}
                  placeholder="All Buildings"
                />
              </div>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={downloadPDF} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden">
          <div className="p-4">
            <Filtermobile
              options={['Building 1', 'Building 2', 'Building 3'].map(building => [building, building])}
              selectedValue={filters.building}
              onChange={(value) => handleFilterChange('building', value)}
              placeholder="Select Building"
            />
          </div>
        </div>

        {/* Table displaying filtered data */}
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
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
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
