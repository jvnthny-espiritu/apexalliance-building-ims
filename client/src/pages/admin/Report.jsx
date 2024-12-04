import React, { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import templateImage from "../../assets/img/BatStateU_Template.png";
import Filter from "../../components/Filter";
import api from "../../services/api";
import Papa from "papaparse";

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [filters, setFilters] = useState({
    campus: "",
    building: "",
    room: "",
    assetName: "",
    assetUnits: "",
    assetCondition: "",
    assetStatus: "",
    reportType: "building_room_assets",
  });
  const [allBuildings, setAllBuildings] = useState([]);
  const [allCampuses, setAllCampuses] = useState([]);

  // Fetch campuses when component mounts
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get("/api/campuses");
        if (response.status === 200) {
          setAllCampuses(response.data.map((campus) => campus.name));
        }
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    };
    fetchCampuses();
  }, []);

useEffect(() => {
  const fetchBuildings = async () => {
    try {

      const queryParams = new URLSearchParams({
        campus: filters.campus || "", 
      });

      const response = await api.get(`/api/buildings/campus-buildings?${queryParams}`);

      if (response.status === 200) {
        setAllBuildings(response.data.map((building) => building.name));
      } else {
        setAllBuildings([]);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setAllBuildings([]);
    }
  };

  fetchBuildings();
}, [filters.campus]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          type: filters.reportType || "building_room_assets",
          campus: filters.campus || "",
          building: filters.building || "",
          room: filters.room || "",
          assetName: filters.assetName || "",
          assetUnits: filters.assetUnits || "",
          assetCondition: filters.assetCondition || "",
          assetStatus: filters.assetStatus || "",
        });

        const response = await api.get(
          `/api/reports/export?${queryParams.toString()}`,
          {
            responseType: "text",
          }
        );

        if (response.status === 200 && typeof response.data === "string") {
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
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    filters.reportType,
    filters.campus,
    filters.building,
    filters.room,
    filters.assetName,
    filters.assetUnits,
    filters.assetCondition,
    filters.assetStatus,
  ]);

  useEffect(() => {
    const currentDate = new Date();
    const formatted = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFormattedDate(formatted);
  }, []);

  const statusOptions = useMemo(
    () => [
      "good condition",
      "not working",
      "for replacement",
      "under maintenance",
    ],
    []
  );
  const allStatusOptions = useMemo(
    () => ["All Statuses", ...statusOptions],
    [statusOptions]
  );
  

  const campusOptions = useMemo(
    () => ["All Campuses", ...allCampuses],
    [allCampuses]
  );

  const buildingOptions = useMemo(
    () => ["All Buildings", ...allBuildings],
    [allBuildings]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const isBuildingMatch = filters.building
        ? item.Building === filters.building
        : true;
  
      const isStatusMatch = filters.assetStatus === "All Statuses" || !filters.assetStatus
      ? true
      : item.Status === filters.assetStatus;    
  
      return isBuildingMatch && isStatusMatch;
    });
  }, [data, filters.building, filters.assetStatus]);    

  const handleFilterChange = (key, value) => {
    setFilters((prevState) => {
      const updatedFilters = { ...prevState };

      if (key === "campus" && value === "All Campuses") {
        updatedFilters[key] = "";
        updatedFilters.building = ""; 
      } else if (key === "building" && value === "All Buildings") {
        updatedFilters[key] = "";
      } else if (key === "assetStatus" && value === "All Statuses") {
        updatedFilters[key] = ""; 
      } else {
        updatedFilters[key] = value;
      }
  
      return updatedFilters;
    });
  };
  

  const downloadPDF = () => {
    try {
        const doc = new jsPDF();
        const margin = 72;
        const primaryColor = "#FF0000";
        const primaryLight = "#ff2222";
        const darkGray = "#808080";
        const black = "#000000";

        const addTemplate = (pageNumber) => {
            doc.addImage(templateImage, "PNG", 0, 0, 210, 297); // A4 size
            doc.setFont("times");
            doc.setFontSize(12);

            if (pageNumber === 1) {
                doc.setFont("times", "normal");
                doc.text(formattedDate, 25, 56);
                doc.text(
                    "Batangas State University - The National Engineering University",
                    25,
                    61
                );
                const titleText = "STATUS REPORT";
                const titleXPos =
                    (doc.internal.pageSize.width - doc.getTextWidth(titleText)) / 2;
                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.text(titleText, titleXPos, margin);
            }

            doc.setFont("times", "bold");
            doc.text("Project and Facility Management", 25, 51);
        };

        // Prepare the table data
        const tableData = filteredData.map((item) => [
            item.Building,
            item.Room,
            item.Asset,
            item.Units,
            item.Condition,
            item.Status,
        ]);


        doc.autoTable({
            startY: margin + 3, 
            margin: { horizontal: 25, bottom: 25, top: 55 },
            head: [["Building", "Room", "Asset", "Units", "Condition", "Status"]],
            body: tableData,
            headStyles: {
                fillColor: primaryLight,
                textColor: "#ffffff",
                fontSize: 12,
                font: "Times New Roman",
            },
            bodyStyles: {
                textColor: black,
                fontSize: 10,
                font: "Times New Roman",
            },
            alternateRowStyles: {
                fillColor: "#F5F5F5",
            },
            showHead: "firstPage",
            didDrawPage: (data) => {
                const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
                addTemplate(pageNumber);

                const pageHeight = doc.internal.pageSize.height;
                const tableBottom = data.cursor.y;

                if (tableBottom + 20 > pageHeight) {
                    const remainingRows = tableData.slice(data.cursor.rowIndex);

                    if (remainingRows.length > 0) {
                        doc.addPage();
                        addTemplate(pageNumber + 1);

                        doc.autoTable({
                            startY: margin + 10, 
                            margin: { horizontal: 25, bottom: 20 },
                            head: [["Building", "Room", "Asset", "Units", "Condition", "Status"]],
                            body: remainingRows,
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
                    }
                }
            },
        });

        doc.save("Report.pdf");
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

  
  return (
    <div className="container sm:mb-16 md:mx-auto mt-16 p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div>
            <h1 className="text-lg font-semibold">Status Report</h1>
            <p className="text-sm">{formattedDate}</p>
            <p className="text-sm">
              Batangas State University - The National Engineering University
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              {/* FILTERS SECTION */}

              <div className="flex gap-4">
                {/* Building Filter */}
                <div className="w-18 hidden md:flex">
                <Filter
                  options={campusOptions.map((campus) => [campus, campus])} 
                  selectedValue={filters.campus || "All Campuses"}
                  onChange={(value) => handleFilterChange("campus", value)}
                  placeholder="Select Campus"
                />
              </div>
                <div className="w-18 hidden md:flex">
                  <Filter
                    options={buildingOptions.map((option) => [option, option])}
                    selectedValue={filters.building || "All Buildings"}
                    onChange={(value) => handleFilterChange("building", value)}
                    placeholder="Select Building"
                  />
                </div>

                {/* Status Filter */}
                <div className="w-18 hidden md:flex">
                <Filter
                  options={allStatusOptions.map((option) => [option, option])}
                  selectedValue={filters.assetStatus || "All Statuses"}
                  onChange={(value) => handleFilterChange("assetStatus", value)}
                  placeholder="Select Status"
                />
                </div>
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

        <div className="md:hidden bg-primary pb-4 ">
          {/* MOBILE FILTERS */}
          <div className="flex justify-between items-center ">
            {/* Building Filter */}
            <div className="w-18 ml-10">
            <Filter
                  options={campusOptions.map((campus) => [campus, campus])} 
                  selectedValue={filters.campus || "All Campuses"}
                  onChange={(value) => handleFilterChange("campus", value)}
                  placeholder="Select Campus"
                />
            </div>
            <div className="w-18 ml-10">
              <Filter
                options={buildingOptions.map((option) => [option, option])}
                selectedValue={filters.building || "All Buildings"}
                onChange={(value) => handleFilterChange("building", value)}
                placeholder="Select Building"
              />
            </div>

            {/* Status Filter */}
            <div className="w-18 mr-10 ">
              <Filter
                options={["All Statuses", ...statusOptions].map((option) => [
                  option,
                  option,
                ])}
                selectedValue={filters.assetStatus || "All Statuses"}
                onChange={(value) => handleFilterChange("assetStatus", value)}
                placeholder="Select Status"
              />
            </div>
          </div>
        </div>

        <div className="table-container">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto h-[calc(100vh-90px] lg:overflow-y-auto h-[calc(100vh-240px)]">
            <table className=" md:min-w-full bg-white ">
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
                    <td colSpan="6" className="py-4 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Reports;