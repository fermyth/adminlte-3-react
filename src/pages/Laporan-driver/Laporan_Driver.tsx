import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";
import DriverReportTable from "./components/Driver_Report_Table1";

import ApiConfig, { UrlServer } from "@app/libs/Api1";
import Footer from "../Footer";
import ExcelJS from 'exceljs';
import { documentId } from "firebase/firestore";
import { saveAs } from 'file-saver';

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
        console.log('cekdatass', response.data);
        
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
    const worksheet = workbook.addWorksheet("Laporan Driver");

    // Header utama
    worksheet.getCell('A1').value = 'No';
    worksheet.getCell('B1').value = 'Nama';
    worksheet.getCell('C1').value = 'Perusahaan';

    // Mengumpulkan tanggal unik dari data untuk header dinamis
    const tanggalSet = new Set();
    data.forEach(item => {
        Object.keys(item.timesheet).forEach(date => {
            tanggalSet.add(date);
        });
    });
    const uniqueDates = Array.from(tanggalSet);
 
    // Membuat header dinamis berdasarkan jumlah tanggal
    let colIndex = 5; // Memulai setelah kolom d
    uniqueDates.forEach(date => {
      
        // Menambahkan header utama dengan keterangan
        worksheet.mergeCells(1, colIndex, 1, colIndex + 1); // Merging cells for "Check In"
        worksheet.getCell(1, colIndex).value = 'Check In';
        
        worksheet.mergeCells(1, colIndex + 2, 1, colIndex + 3); // Merging cells for "Check Out"
        worksheet.getCell(1, colIndex + 2).value = 'Check Out';

        worksheet.mergeCells(1, colIndex + 4, 1, colIndex + 5); // Merging cells for "Luar Kota"
        worksheet.getCell(1, colIndex + 4).value = 'Luar Kota';

        // Menambahkan subheader
        worksheet.getCell(2, colIndex).value = 'Jam Masuk';
        worksheet.getCell(2, colIndex + 1).value = 'KM Masuk';
        worksheet.getCell(2, colIndex + 2).value = 'Jam Keluar';
        worksheet.getCell(2, colIndex + 3).value = 'KM Keluar';
        worksheet.getCell(2, colIndex + 4).value = 'Pulang Pergi';
        worksheet.getCell(2, colIndex + 5).value = 'Menginap';

        colIndex += 7; // Pindah ke set kolom berikutnya
    });

    // Menambahkan gaya untuk header
    [1, 2].forEach(rowNumber => {
        worksheet.getRow(rowNumber).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00A67E' }
            };
            cell.font = {
                name: 'Calibri',
                size: 11,
                color: { argb: 'FFFFFF' },
                bold: true
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFFFFF' } },
                left: { style: 'thin', color: { argb: 'FFFFFF' } },
                bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
                right: { style: 'thin', color: { argb: 'FFFFFF' } }
            };
        });
    });

    // Menambahkan data rows
    data.forEach((item, index) => {
        const rowData = [
            index + 1,
            item.nama,       // Nama driver
            item.company_name  // Nama perusahaan
        ];

        // Menambahkan data dinamis berdasarkan tanggal
        uniqueDates.forEach(date => {
            const timesheet = item.timesheet[date] || {};
            rowData.push(
                date,
                timesheet.jam_masuk || '',
                timesheet.km_in || '',
                timesheet.jam_keluar || '',
                timesheet.km_out || '',
                timesheet.lk_pp || '',
                timesheet.lk_inap || ''
            );
        });

        // Menambahkan baris data ke worksheet
        const row = worksheet.addRow(rowData);

        // Style data rows
        row.eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            };
        });

        // Alternating row colors
        if (index % 2 === 1) {
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'F2F2F2' }
                };
            });
        }
    });

    // Set column widths
    worksheet.columns.forEach((column) => {
        column.width = 15; // Sesuaikan lebar kolom di sini
    });

    // Generate Excel file
    try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Laporan_Driver.xlsx');
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
        {isFiltered && <DriverReportTable data={data} loadingdata={isLoading} />}
      </div>
      <div className="pt-4 pb-1">
        <Footer />
      </div>
    </>
  );
}
export default LaporanDriver;
