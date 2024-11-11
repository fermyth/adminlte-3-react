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
import { date } from "yup";

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
  nama_driver: string | null;
  name_users: string;
  user_id: number; // Pastikan properti ini ada
  id_driver?: number; // Tambahkan properti ini jika perlu
  expenses_type: string;
  expenses_value: number;
  expenses_notes: string;
  date_timestamp: string;
  timesheet: { [key: string]: Timesheet };
}

interface ApiResponse {
  success: boolean;
  data: DriverData[];
}

function LaporanDriver() {
  const [dataexpanse, setDataexpanse] = useState<DriverData[]>([]);
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [data, setData] = useState<DriverData[]>([]);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isNoData, setIsNoData] = useState<boolean>(false);

  useEffect(() => {
    // Mendapatkan tanggal hari ini dan menambah satu hari
    const today = new Date();
    today.setDate(today.getDate() + 1); // Menambahkan 1 hari ke tanggal hari ini
    const nextDay = today.toISOString().split("T")[0];
    
    // Mengatur tanggal mulai dan akhir ke tanggal yang sudah maju satu hari
    setStartDate(nextDay);
    setEndDate(nextDay);
  }, []);
  
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };
  
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        console.log("cekdatass", response.data.dataexpanse);

        setData(response.data.data);
        setDataexpanse(response.data.dataexpanse);
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

    const formatThousand = (value: any) => {
      if (value === null || value === undefined) return "";
      return new Intl.NumberFormat("id-ID").format(value);
    };

    // Format tanggal
    const formattedStartDate = new Date(startDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedEndDate = new Date(endDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Merged header for title
    worksheet.mergeCells("A2:K2");
    worksheet.getCell("A2").value = `Laporan Aktivitas Driver`;
    worksheet.getCell("A2").font = { bold: true, size: 14 };
    worksheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Merged header for date range
    worksheet.mergeCells("A3:K3");
    worksheet.getCell(
      "A3"
    ).value = `Periode: ${formattedStartDate} - ${formattedEndDate}`;
    worksheet.getCell("A3").font = { bold: true, size: 12 };
    worksheet.getCell("A3").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Main headers
    const headers = [
      "No",
      "Nama Driver",
      "Perusahaan",
      "Nama User",
      "Tanggal",
      "Check In",
      "", // Placeholder for merged cell
      "Check Out",
      "", // Placeholder for merged cell
      "Luar Kota",
      "",
    ];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + index)}4`);
      cell.value = header;
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { bold: true };
    });

    // Merging cells for "Check In", "Check Out", and "Luar Kota"
    worksheet.mergeCells("F4:G4");
    worksheet.getCell("F4").value = "Check In";

    worksheet.mergeCells("H4:I4");
    worksheet.getCell("H4").value = "Check Out";

    worksheet.mergeCells("J4:K4");
    worksheet.getCell("J4").value = "Luar Kota";

    // Sub-headers for check-in, check-out, and luar kota sections
    const subHeaders = [
      "Jam Masuk",
      "KM Masuk",
      "Jam Keluar",
      "KM Keluar",
      "Pulang Pergi",
      "Menginap",
    ];

    subHeaders.forEach((subHeader, index) => {
      worksheet.getCell(`${String.fromCharCode(70 + index)}5`).value =
        subHeader;
      worksheet.getCell(`${String.fromCharCode(70 + index)}5`).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell(`${String.fromCharCode(70 + index)}5`).font = {
        bold: true,
      };
    });

    // Styling headers
    const headerCells = [
      "A4",
      "B4",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "H4",
      "I4",
      "J4",
      "K4",
      "F5",
      "G5",
      "H5",
      "I5",
      "J5",
      "K5",
    ];

    headerCells.forEach((cell) => {
      const worksheetCell = worksheet.getCell(cell);
      worksheetCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9D9D9" },
      };
      worksheetCell.font = { bold: true };
      worksheetCell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheetCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Fill in data rows
    let rowIndex = 6; // Start after header rows
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        Object.keys(item.timesheet).forEach((date) => {
          const timesheet = item.timesheet[date] || {};
          const formatTime = (time: any) => {
            if (!time || time === "-") return ""; // Return empty string if time is null or "-"
            const [hours, minutes, seconds] = time.split(":");
            const formattedHours = hours ? hours.padStart(2, "0") : "00";
            const formattedMinutes = minutes ? minutes.padStart(2, "0") : "00";
            const formattedSeconds = seconds ? seconds.padStart(2, "0") : "00";
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
          };

          // Skip row if "Jam Masuk" is "-"
          if (timesheet.jam_masuk === "-") return;

          const rowData = [
            index + 1, // No
            item.nama !== null && item.nama !== undefined ? item.nama : "", // Nama Driver
            item.company_name !== null && item.company_name !== undefined
              ? item.company_name
              : "", // Perusahaan
            timesheet.name_users && timesheet.name_users !== "null"
              ? timesheet.name_users
              : "", // Nama User
            date !== null && date !== undefined ? date : "", // Tanggal
            formatTime(timesheet.jam_masuk) || "", // Jam Masuk
            timesheet.km_in !== null && timesheet.km_in !== undefined
              ? formatThousand(timesheet.km_in)
              : "", // KM Masuk
            formatTime(timesheet.jam_keluar) || "", // Jam Keluar
            timesheet.km_out !== null && timesheet.km_out !== undefined
              ? formatThousand(timesheet.km_out)
              : "", // KM Keluar
            timesheet.lk_pp && timesheet.lk_pp !== "null"
              ? timesheet.lk_pp
              : "", // Pulang Pergi
            timesheet.lk_inap !== null && timesheet.lk_inap !== undefined
              ? timesheet.lk_inap
              : "", // Menginap
          ];

          // Add a new row with the data
          const row = worksheet.addRow(rowData);

          // Apply alignment and borders to each cell in the row
          row.eachCell((cell, colNumber) => {
            cell.alignment = {
              vertical: "middle",
              horizontal:
                colNumber === 2 || colNumber === 3 || colNumber === 4
                  ? "left"
                  : "center",
              wrapText:
                colNumber === 2 ||
                colNumber === 3 ||
                colNumber === 4 ||
                colNumber === 10 ||
                colNumber === 11,
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            // Apply Rupiah format to "KM Masuk" (column G) and "KM Keluar" (column I)
            if (colNumber === 7 || colNumber === 9) {
              cell.numFmt = "Rp #,##0";
            }
          });

          rowIndex += 1; // Move to the next row
        });
      });
    }

    // Set column widths
    const columnWidths = [5, 20, 20, 20, 12, 10, 10, 10, 10, 15, 15];
    columnWidths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

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

  const handleDownloadKalim = async () => {
    const formatThousand = (value: any) => {
      if (value === null || value === undefined) return "";
      return new Intl.NumberFormat("id-ID").format(value);
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan");

    // Menambahkan judul utama
    worksheet.mergeCells("A1:H1");
    worksheet.getCell("A1").value = "Laporan uang operasional driver";
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("A1").font = { bold: true, size: 14 };

    // Format tanggal yang konsisten: "DD/MM/YYYY"
    const formattedStartDate = new Date(startDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedEndDate = new Date(endDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Menambahkan judul periode dengan format tanggal yang sama
    worksheet.mergeCells("A2:H2");
    worksheet.getCell(
      "A2"
    ).value = `Periode: ${formattedStartDate} - ${formattedEndDate}`; // Periode dengan format tanggal yang sama
    worksheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("A2").font = { bold: true, size: 12 };

    // Menambahkan header tabel
    const headers = [
      "No",
      "Nama Driver",
      "Perusahaan",
      "Tanggal",
      "Kategory",
      "Nilai",
      "Keterangan",
    ];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + index)}3`);
      cell.value = header;
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      cell.border = {
        top: { style: "medium", color: { argb: "808080" } },
        left: { style: "medium", color: { argb: "808080" } },
        bottom: { style: "medium", color: { argb: "808080" } },
        right: { style: "medium", color: { argb: "808080" } },
      };
    });

    // Data contoh yang akan diisi pada tabel
    dataexpanse.forEach((item, rowIndex) => {
      if (!item) {
        console.warn("Item is undefined or null", item);
        return; // Lewati jika item tidak valid
      }

      const rowData = [
        rowIndex + 1, // No
        item.nama_driver, // Nama Driver
        item.company_name || "", // Perusahaan
        item.date_timestamp, // Tanggal
        item.expenses_type, // Kategory
        formatThousand(item.expenses_value), // Nilai
        item.expenses_notes && item.expenses_notes !== "null"
          ? item.expenses_notes
          : "", // Keterangan
      ];

      // Mengisi data dan memberikan style pada setiap baris data
      rowData.forEach((value, colIndex) => {
        const cell = worksheet.getCell(
          `${String.fromCharCode(65 + colIndex)}${rowIndex + 4}`
        );
        cell.value = value;

        // Atur alignment berdasarkan kolom: center untuk kolom "No", left untuk kolom lainnya
        cell.alignment = {
          vertical: "middle",
          horizontal: colIndex === 0 ? "center" : "left", // Kolom pertama (No) center, lainnya left
          wrapText: colIndex === 1 || colIndex === 2 || colIndex === 6,
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Mengatur lebar kolom agar isi tabel terlihat rapi
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 10;

    // Menyimpan workbook ke file Excel
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Laporan_Klaim_Driver.xlsx");
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
              Export Laporan Driver Excel
            </button>
            <button
              type="button"
              className="btn btn-success custom-btn"
              onClick={handleDownloadKalim}
            >
              Export Klaim Driver Excel
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
