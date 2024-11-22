import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import templateImage from '../../assets/img/BatStateU Template.png';
import Filter, { Filtermobile } from '../../components/Filter'; 
import api from '../../services/api';
import Papa from 'papaparse';

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [filters, setFilters] = useState({
    campus: '', 
    building: '', 
    room: '',
    assetName: '',
    assetUnits: '', 
    assetCondition: '', 
    assetStatus: '', 
    reportType: 'building_room_assets',  
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
        try {
          const queryParams = new URLSearchParams({
            type: filters.reportType || 'building_room_assets',
            campus: filters.campus || '',
            building: filters.building || '',
            room: filters.room || '',
            assetName: filters.assetName || '',
            assetUnits: filters.assetUnits || '',
            assetCondition: filters.assetCondition || '',
            assetStatus: filters.assetStatus || '',
          });

            const response = await api.get(`/api/reports/export?${queryParams.toString()}`, {
                responseType: 'text',
            });

            if (response.status === 200 && typeof response.data === 'string') {
                Papa.parse(response.data, {
                    header: true,
                    complete: (result) => {
                        setData(result.data);
                    },
                });
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        } finally {
          setLoading(false);
        }
    };

    fetchData();
}, [filters]);

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

  const statusOptions = [
    'good condition',
    'not working',
    'for replacement',
    'under maintenance',
  ];
  const buildingOptions = useMemo(() => {
    const buildings = [...new Set(data.map(item => item.Building).filter(Boolean))];
    return buildings;
  }, [data]);
  const combinedOptions = useMemo(() => {
    return ['All Buildings', ...buildingOptions, ...statusOptions];
  }, [buildingOptions, statusOptions]);  

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (!filters.buildingOrStatus) return true;
  
      const isBuildingMatch = item.Building === filters.buildingOrStatus;
      const isStatusMatch = item.Status === filters.buildingOrStatus;
      return isBuildingMatch || isStatusMatch;
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

    const tableData = filteredData.map(item => [
      item.Building,
      item.Room,
      item.Asset,
      item.Units,
      item.Condition,
      item.Status,
  ]);

    doc.autoTable({
      startY: margin + 3, //add 3 for margin below the title
      margin: { horizontal: 25 },
      head: [['Building', 'Room', 'Asset', 'Units', 'Condition', 'Status']],
      body: tableData,
      headStyles: {
        fillColor: primaryLight, 
        textColor: "#ffffff",     
        fontSize: 12,    
        font: "Times New Roman",        
      },
      bodyStyles: {
        textColor: darkGray,      
        fontSize: 10,  
        font: "Times New Roman",          
      },
      alternateRowStyles: {
        fillColor: "#F5F5F5",     
      },
    });

    doc.output('dataurlnewwindow');
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [key]: value === "All Buildings" ? "" : value,
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
                  options={combinedOptions.map(option => [option, option])}
                  selectedValue={filters.buildingOrStatus}
                  onChange={(value) => handleFilterChange('buildingOrStatus', value)}
                  placeholder="Select a Building or Status"
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
              options={combinedOptions.map(option => [option, option])}
              selectedValue={filters.buildingOrStatus}
              onChange={(value) => handleFilterChange('buildingOrStatus', value)}
              placeholder="Select a Building or Status"
            />
          </div>
        </div>

        {/* Table displaying filtered data */}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">BUILDING</th>
                <th className="py-2 px-4 border-b text-left">ROOM</th>
                <th className="py-2 px-4 border-b text-left">ASSET</th>
                <th className="py-2 px-4 border-b text-left">UNITS</th>
                <th className="py-2 px-4 border-b text-left">REPORT</th>
                <th className="py-2 px-4 border-b text-left">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{item.Building}</td>
                    <td className="py-2 px-4 border-b">{item.Room}</td>
                    <td className="py-2 px-4 border-b">{item.Asset}</td>
                    <td className="py-2 px-4 border-b">{item.Units}</td>
                    <td className="py-2 px-4 border-b">{item.Condition}</td>
                    <td className="py-2 px-4 border-b">{item.Status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
