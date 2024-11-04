import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";
import DriverReportTable from "./components/Driver_Report_Table";

import ApiConfig, { UrlServer } from "@app/libs/Api";
import Footer from "../Footer";
import ExcelJS from "exceljs";
import { documentId } from "firebase/firestore";
import { saveAs } from "file-saver";

const eventEmitter = new EventEmitter();
const apiUrl = UrlServer() + "/laporan_driver";
//const apiUrl = 'https://api_portal.sigapdriver.com/api/v1/laporan_driver';

interface Timesheet {
  jam_masuk: string;
  jam_keluar: string;
  km_in: string;
  km_out: string;
  lk_pp: string | null;
  lk_inap: string;
  lain_lain: string;
  nopol: string | null;
  name_users: string;
  km_in_images: string | null;
  km_out_images: string | null;
  lat_km_in: string | null;
  long_km_in: string | null;
  lat_km_out: string | null;
  long_km_out: string | null;
  lat_lk_pp: string | null;
  long_lk_pp: string | null;
  lat_lk_inap: string | null;
  long_lk_inap: string | null;
}

interface DriverData {
  company_name: any;
  nama: string | null;
  name_users: string;
  user_id: number | null;
  timesheet: { [key: string]: Timesheet };
}

interface ApiResponse {
  success: boolean;
  data: DriverData[];
}

function LaporanDriver() {
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [data, setData] = useState<DriverData[]>([]);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isNoData, setIsNoData] = useState<boolean>(false);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const fetchLaporanDriver = useCallback(
    async (companyId: any) => {
      let url = `${apiUrl}/${startDate}/${endDate}/${companyId}`;

      if (type !== "") {
        url += `/${type}`;
      } else {
        url += `/dummy`;
      }

      console.log("cekdatalaporandriver", url);
      setIsLoading(true);
      setIsError(false);
      setIsNoData(false);

      try {
        const response = await axios.get<ApiResponse>(url);
        console.log("cekdatass", response.data);

        setData(response.data.data);
        setIsFiltered(true);

        if (response.data.data.length === 0) {
          setIsNoData(true);
        }

        // Tambahkan console.log untuk menghitung jumlah data "temporary"
        if (type === "temporary") {
          console.log(`Total data temporary: ${response.data.data.length}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [startDate, endDate, type]
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setIsNoData(false);

    try {
      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsedData = JSON.parse(userData);
        setIdCompany(parsedData.id_company);
        fetchLaporanDriver(parsedData.id_company);
      } else {
        setIdCompany(null);
        setIsError(true);
      }
    } catch (error) {
      console.error("Error fetching id_company from AsyncStorage:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchLaporanDriver]);

  useEffect(() => {
    fetchData();

    const handleStorageChange = () => {
      fetchData();
    };

    eventEmitter.on("storageChange", handleStorageChange);

    return () => {
      eventEmitter.off("storageChange", handleStorageChange);
    };
  }, [fetchData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (idCompany) {
      fetchLaporanDriver(idCompany);
    } else {
      setIsError(true);
    }
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Aktivitas Driver");

    // Merged header for title
    worksheet.mergeCells("A1:J1");
    worksheet.getCell("A1").value = "Laporan Aktivitas Driver";
    worksheet.getCell("A1").font = { bold: true, size: 14 };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Main headers
    worksheet.getCell("A2").value = "No";
    worksheet.getCell("B2").value = "Nama Driver";
    worksheet.getCell("C2").value = "Perusahaan";
    worksheet.getCell("D2").value = "Tanggal";

    // Merged cells for "Check in" and "Check Out" sections
    worksheet.mergeCells("E2:F2");
    worksheet.getCell("E2").value = "Check in";
    worksheet.getCell("E2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.mergeCells("G2:H2");
    worksheet.getCell("G2").value = "Check Out";
    worksheet.getCell("G2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.mergeCells("I2:J2");
    worksheet.getCell("I2").value = "Luar Kota";
    worksheet.getCell("I2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Sub-headers for check-in, check-out, and luar kota
    worksheet.getCell("E3").value = "Jam Masuk";
    worksheet.getCell("F3").value = "KM Masuk";
    worksheet.getCell("G3").value = "Jam Keluar";
    worksheet.getCell("H3").value = "KM Keluar";
    worksheet.getCell("I3").value = "Pulang Pergi";
    worksheet.getCell("J3").value = "Menginap";

    // Style headers with gray background and bold text
    const headerCells = [
      "A2",
      "B2",
      "C2",
      "D2",
      "E2",
      "G2",
      "I2",
      "E3",
      "F3",
      "G3",
      "H3",
      "I3",
      "J3",
    ];
    headerCells.forEach((cell) => {
      worksheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9D9D9" },
      };
      worksheet.getCell(cell).font = { bold: true };
      worksheet.getCell(cell).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell(cell).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    let rowIndex = 4; 
    data.forEach((item, index) => {
      const baseRow = [
        index + 1, 
        item.nama,
        item.company_name,
      ];

      Object.keys(item.timesheet).forEach((date) => {
        const timesheet = item.timesheet[date] || {};

        const rowData = [
          ...baseRow,
          date,
          timesheet.jam_masuk || "",
          timesheet.km_in || "",
          timesheet.jam_keluar || "",
          timesheet.km_out || "",
          timesheet.lk_pp || "",
          timesheet.lk_inap || "",
        ];

        const row = worksheet.addRow(rowData);

        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        rowIndex += 1; 
      });
    });

    worksheet.getColumn(1).width = 5; 
    worksheet.getColumn(2).width = 20; 
    worksheet.getColumn(3).width = 20; 
    worksheet.getColumn(4).width = 15; 
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 10;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;

    // Generate Excel file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Laporan_Aktivitas_Driver.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      alert("Terjadi kesalahan saat mengunduh file Excel. Silakan coba lagi.");
    }
  };

  return (
    <>
      <style>
        {`
         .btn-success.custom-btn {
          background-color: #009879;
          border-color: #009879;
        }

        .btn-success.custom-btn:hover {
          background-color: #007f66;
          border-color: #007f66;
        } 
          .spinner {
           border: 4px solid #f3f3f3; 
           border-top: 4px solid #009879;
           border-radius: 50%;
           width: 40px;
           height: 40px;
           animation: spin 2s linear infinite;
        }
         @keyframes spin {
         0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }
        `}
      </style>
      <div className="container mb-5">
        <h1 className="text-center mb-4 font-weight-bold text-uppercase mb-3 mt-5">
          LAPORAN DRIVER
        </h1>
        <form
          onSubmit={handleSubmit}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="d-flex">
            <div className="">
              <label htmlFor="type" className="form-label">
                Type
              </label>
              <select
                className="form-select"
                id="type"
                value={type}
                style={{ width: "200px" }}
                onChange={handleTypeChange}
              >
                <option value="no_temporary">Job Holder</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div className="col-md">
              <label htmlFor="startDate" className="form-label">
                Tanggal Awal
              </label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  style={{ width: "200px" }}
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </div>
            </div>
            <div className="">
              <label htmlFor="endDate" className="form-label">
                Tanggal Akhir
              </label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  style={{ width: "200px" }}
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
          </div>
          <div
            className="d-grid gap-2 d-md-flex justify-content-md-end "
            style={{ marginTop: "30px", marginLeft: "15px" }}
          >
            <button type="submit" className="btn btn-dark me-md-2">
              Filter
            </button>
            <button
              type="button"
              className="btn btn-success custom-btn"
              onClick={handleDownloadExcel}
            >
              Download Excel
            </button>
          </div>
        </form>
      </div>
      <center>
        {isLoading && <div className="spinner"></div>}
        {isNoData && <p>Tidak ada data yang ditemukan.</p>}
        {isError && data.length === 0 && <div className="spinner"></div>}
      </center>

      <div className="info-box">
        {isFiltered && (
          <DriverReportTable data={data} loadingdata={isLoading} />
        )}
      </div>
      <div className="pt-4 pb-1">
        <Footer />
      </div>
    </>
  );
}
export default LaporanDriver;
