import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ApiConfig from "@app/libs/Api";
import Footer from "../Footer";
import { sign } from "crypto";

const eventEmitter = new EventEmitter();

interface TableData {
  name: string;
  monday: string[];
  company_names: string;
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
  totalWorkHours: string;
  totalRestHours: string;
  colorCode: string;
}

const ContentHeader: React.FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [tglselect, settglselect] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [datanopol, setdatanopol] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const selectedDate = tglselect || startDate;
      const typedata = type;

      if (!selectedDate) {
        console.error("Selected date is invalid");
        setLoading(false);
        return;
      }

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const getstorage = JSON.parse(userData);
        console.log("cekdata", getstorage, typedata);
        setIdCompany(getstorage.id_company);
        await fetchDatagreatday(selectedDate, getstorage.id_company, typedata);
      } else {
        setIdCompany(null);
      }
    } catch (error) {
      console.error("Error fetching id_company from AsyncStorage:", error);
    } finally {
      setLoading(false);
    }
  }, [tglselect, startDate]);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    let formattedDate = startDate;
    if (!startDate) {
      formattedDate = today.toISOString().split("T")[0];
      setStartDate(formattedDate);
    }
    //alert(type);
    if (type == null) {
      fetchData();
      setLoading(false);
    }
    calculateDates(formattedDate);

    const handleStorageChange = () => {
      fetchData();
    };

    eventEmitter.on("storageChange", handleStorageChange);

    return () => {
      eventEmitter.off("storageChange", handleStorageChange);
    };
  }, [tglselect, startDate, fetchData]);

  const fetchDatagreatday = async (
    start: string,
    idCompany: string,
    typedata: string
  ) => {
    try {
      const response = await ApiConfig.get(
        `/laporan_jam_kerja/${idCompany}/${start}/${typedata}`
      );
      const data = response.data.data;
      setdatanopol(data.plat_nomor);
      console.log("datacekdataemp", data);

      setCompanyName(data.company_name);

      const { drivers, jam_masuk, jam_keluar, awh, company_names, plat_nomor } =
        data;

      console.log("datacekdataempplat_nomor", drivers, plat_nomor);

      const formattedData = drivers.map((driver: any, index: number) => {
        return {
          name: driver,
          plat_nomor: plat_nomor[index]?.nopol || "-",
          company_names: company_names[index],
          monday: [
            formatTime(jam_masuk[driver][0]),
            formatTime(jam_keluar[driver][0]),
          ],
          tuesday: [
            formatTime(jam_masuk[driver][1]),
            formatTime(jam_keluar[driver][1]),
          ],
          wednesday: [
            formatTime(jam_masuk[driver][2]),
            formatTime(jam_keluar[driver][2]),
          ],
          thursday: [
            formatTime(jam_masuk[driver][3]),
            formatTime(jam_keluar[driver][3]),
          ],
          friday: [
            formatTime(jam_masuk[driver][4]),
            formatTime(jam_keluar[driver][4]),
          ],
          saturday: [
            formatTime(jam_masuk[driver][5]),
            formatTime(jam_keluar[driver][5]),
          ],
          sunday: [
            formatTime(jam_masuk[driver][6]),
            formatTime(jam_keluar[driver][6]),
          ],
          totalWorkHours:
            awh[driver] && awh[driver].split(" || ")[0] !== "00:00"
              ? awh[driver].split(" || ")[0]
              : "-",
          totalRestHours:
            awh[driver] && awh[driver].split(" || ")[1] !== "00:00"
              ? awh[driver].split(" || ")[1]
              : "-",
          colorCode: calculateColor(awh[driver]),
        };
      });

      setTableData(formattedData);

      console.log("formattedData:", formattedData);
    } catch (error) {
      console.log("Error fetching data from API:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    if (typeof time !== "string" || !time.trim()) {
      return "-";
    }

    const [hours, minutes] = time.split(":");
    if (hours && minutes) {
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    } else {
      return "-";
    }
  };

  const calculateDates = (start: string) => {
    settglselect(start);
    const startDate = new Date(start);
    const selectedDayIndex = startDate.getDay();
    const daysToAdd = selectedDayIndex === 0 ? -6 : 1 - selectedDayIndex;
    startDate.setDate(startDate.getDate() + daysToAdd);
    const newDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      newDates.push(date.toISOString().split("T")[0]);
    }
    setDates(newDates);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const selectedDate = tglselect || startDate;
      const typedata = type;

      if (!selectedDate) {
        console.error("Selected date is invalid");
        return;
      }

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const getstorage = JSON.parse(userData);
        console.log("cekdata", getstorage, typedata);
        setIdCompany(getstorage.id_company);
        await fetchDatagreatday(selectedDate, getstorage.id_company, typedata);
        calculateDates(startDate); // Move here to ensure it runs after fetching data
      } else {
        setIdCompany(null);
      }
    } catch (error) {
      console.error("Error fetching id_company from AsyncStorage:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleDownloadExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Jam Kerja");

    // Menambahkan judul di atas tabel
    const titleRow = worksheet.addRow(["Data Laporan Jam Kerja Mingguan"]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.mergeCells("A1:R1"); // Menggabungkan sel untuk pusat judul di atas tabel

    // Menambahkan rentang tanggal
    const dateRangeRow = worksheet.addRow([
      `Tanggal: ${dates[0]} - ${dates[dates.length - 1]}`,
    ]);
    dateRangeRow.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.mergeCells("A2:R2"); // Menggabungkan sel untuk pusat rentang tanggal di bawah judul

    // Membuat header dengan struktur vertikal untuk Jam Masuk dan Jam Keluar
    const headerRow1 = [
      "Nama Driver",
      "Nama Perusahaan",
      ...dates.flatMap(() => ["Jam Masuk", "Jam Keluar"]),
      "Total Jam Kerja",
      "Total Jam Istirahat",
    ];
    const headerRow2 = [
      "",
      "",
      ...dates.flatMap((date) => [date, date]),
      "",
      "",
    ];

    worksheet.addRow([]); // Menambahkan baris kosong untuk pemisah antara judul dan tabel
    worksheet.addRow(headerRow1);
    const header = worksheet.addRow(headerRow2);

    // Menggabungkan sel header untuk "Nama Driver" dan "Nama Perusahaan"
    worksheet.mergeCells("A4:A5"); // Nama Driver
    worksheet.mergeCells("B4:B5"); // Nama Perusahaan
    worksheet.mergeCells("Q4:Q5"); // Total Jam Kerja
    worksheet.mergeCells("R4:R5"); // Total Jam Istirahat

    // Styling header untuk baris pertama, termasuk pengaturan rata tengah untuk Nama Driver dan Nama Perusahaan
    worksheet.getRow(4).eachCell((cell, colNumber) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      if (colNumber === 1 || colNumber === 2) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "center" };
      }
    });

    worksheet.getRow(5).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    // Menambahkan data dari `tableData`
    tableData.forEach((row, index) => {
      const dataRow = [
        row.name,
        row.company_names,
        row.monday[0],
        row.monday[1],
        row.tuesday[0],
        row.tuesday[1],
        row.wednesday[0],
        row.wednesday[1],
        row.thursday[0],
        row.thursday[1],
        row.friday[0],
        row.friday[1],
        row.saturday[0],
        row.saturday[1],
        row.sunday[0],
        row.sunday[1],
        row.totalWorkHours,
        row.totalRestHours,
      ];

      const newRow = worksheet.addRow(dataRow);
      const fillColor = index % 2 === 0 ? "FFFFFF" : "F2F2F2";

      newRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };

        if (colNumber === 1) {
          cell.alignment = { horizontal: "left" };
        } else {
          cell.alignment = { horizontal: "center" };
        }

        if (colNumber % 2 === 0) {
          const exitTime = cell.value;
          if (exitTime) {
            const [hours, minutes] = exitTime.split(":").map(Number);
            if (hours > 23 || (hours === 23 && minutes > 0)) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF8566" },
              };
            }
          }
        }
        if (colNumber === 17) {
          const totalWorkHours = cell.value;
          if (totalWorkHours) {
            const [totalHours, totalMinutes] = totalWorkHours
              .split(":")
              .map(Number);
            const totalInHours = totalHours + totalMinutes / 60;

            if (totalInHours > 60) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF8566" },
              };
            } else if (totalInHours > 58) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" },
              };
            } else if (totalInHours > 40 && totalInHours < 49) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFB3" },
              };
            }
          }
        }
      });
    });

    // Mengatur lebar kolom
    worksheet.getColumn(1).width = 20; // Nama Driver
    worksheet.getColumn(2).width = 30; // Nama Perusahaan
    worksheet.columns.slice(2, -2).forEach((column) => (column.width = 15)); // Kolom Jam Masuk dan Jam Keluar
    worksheet.getColumn(17).width = 20; // Total Jam Kerja
    worksheet.getColumn(18).width = 20; // Total Jam Istirahat

    // Menyimpan file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Laporan_Jam_Kerja.xlsx");
  }

  async function handleDownloadExcelPlatNomor() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Jam Kerja");

    // Menambahkan judul di atas tabel
    const titleRow = worksheet.addRow(["Data Laporan Jam Kerja Mingguan"]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.mergeCells("A1:R1"); // Menggabungkan sel untuk pusat judul di atas tabel

    // Menambahkan rentang tanggal
    const dateRangeRow = worksheet.addRow([
      `Tanggal: ${dates[0]} - ${dates[dates.length - 1]}`,
    ]);
    dateRangeRow.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.mergeCells("A2:R2"); // Menggabungkan sel untuk pusat rentang tanggal di bawah judul

    // Membuat header dengan struktur vertikal untuk Jam Masuk dan Jam Keluar
    const headerRow1 = [
      "Nama Driver",
      "Nama Perusahaan",
      "Plat Nomor",
      ...dates.flatMap(() => ["Jam Masuk", "Jam Keluar"]),
      "Total Jam Kerja",
      "Total Jam Istirahat",
    ];
    const headerRow2 = [
      "",
      "",
      "",
      ...dates.flatMap((date) => [date, date]),
      "",
      "",
    ];

    worksheet.addRow([]); // Menambahkan baris kosong untuk pemisah antara judul dan tabel
    worksheet.addRow(headerRow1);
    const header = worksheet.addRow(headerRow2);

    // Menggabungkan sel header untuk "Nama Driver" dan "Nama Perusahaan"
    worksheet.mergeCells("A4:A5"); // Nama Driver
    worksheet.mergeCells("B4:B5"); // Nama Perusahaan
    worksheet.mergeCells("C4:C5"); // Nama Perusahaan
    worksheet.mergeCells("R4:R5"); // Total Jam Kerja
    worksheet.mergeCells("S4:S5"); // Total Jam Istirahat

    // Styling header untuk baris pertama, termasuk pengaturan rata tengah untuk Nama Driver dan Nama Perusahaan
    worksheet.getRow(4).eachCell((cell, colNumber) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      if (colNumber === 1 || colNumber === 2) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        cell.alignment = { horizontal: "center" };
      }
    });

    worksheet.getRow(5).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    // Menambahkan data dari `tableData`
    tableData.forEach((row, index) => {
      const dataRow = [
        row.name,
        row.company_names,
        row.plat_nomor,
        row.monday[0],
        row.monday[1],
        row.tuesday[0],
        row.tuesday[1],
        row.wednesday[0],
        row.wednesday[1],
        row.thursday[0],
        row.thursday[1],
        row.friday[0],
        row.friday[1],
        row.saturday[0],
        row.saturday[1],
        row.sunday[0],
        row.sunday[1],
        row.totalWorkHours,
        row.totalRestHours,
      ];

      const newRow = worksheet.addRow(dataRow);
      const fillColor = index % 2 === 0 ? "FFFFFF" : "F2F2F2";

      newRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };

        if (colNumber === 1) {
          cell.alignment = { horizontal: "left" };
        } else {
          cell.alignment = { horizontal: "center" };
        }
        if ((colNumber - 3) % 2 === 0 && cell.value) {
          // Kolom Jam Keluar
          const [hour, minute] = cell.value.split(":").map(Number);
          if (hour >= 23) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF8566" },
            };
          }
        }
        if (colNumber === 18) {
          const totalWorkHours = cell.value;
          if (totalWorkHours) {
            const [totalHours, totalMinutes] = totalWorkHours
              .split(":")
              .map(Number);
            const totalInHours = totalHours + totalMinutes / 60;

            if (totalInHours > 60) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF8566" },
              };
            } else if (totalInHours > 58) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" },
              };
            } else if (totalInHours > 40 && totalInHours < 49) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFB3" },
              };
            }
          }
        }
      });
    });

    // Mengatur lebar kolom
    worksheet.getColumn(1).width = 20; // Nama Driver
    worksheet.getColumn(2).width = 30; // Nama Perusahaan
    worksheet.columns.slice(2, -2).forEach((column) => (column.width = 15)); // Kolom Jam Masuk dan Jam Keluar
    worksheet.getColumn(17).width = 20; // Total Jam Kerja
    worksheet.getColumn(18).width = 20; // Total Jam Istirahat

    // Menyimpan file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Laporan_Jam_Kerja.xlsx");
  }

  const calculateColor = (awh: string | undefined) => {
    if (!awh) return "#ffffff";

    const hours = parseInt(awh.split(":")[0]);

    if (hours >= 60) {
      return "#ff8566";
    } else if (hours >= 58 && hours <= 60) {
      return "yellow";
    } else if (hours >= 40 && hours <= 49) {
      return "#ffffb3";
    } else {
      return "#ffffff";
    }
  };

  const getExitTimeColor = (exitTime: string) => {
    if (!exitTime || exitTime === "" || exitTime === "-") return "#ffffff";

    const [hours, minutes] = exitTime.split(":").map(Number);

    if (hours >= 23) return "#ffcc99";

    return "#ffffff";
  };

  return (
    <section className="containers" style={{ padding: 20 }}>
      <div className="text-center mb-4">
        <h1 className="font-weight-bold text-uppercase">Laporan Jam Kerja</h1>
        <p className="font-weight-bold text-uppercase">
          {startDate ? `  ${dates[0]}  - ${dates[6]} ` : "Pilih Tanggal"}
        </p>
      </div>
      <div className="mb-5 w-100 form-wrapper">
        <div className="form-container">
          <div className="form-group d-flex align-items-center justify-content-center">
            <label
              htmlFor="type"
              className="form-label"
              style={{ marginRight: 20 }}
            >
              Type
            </label>
            <select
              className="form-select"
              id="type"
              value={type}
              style={{ width: "200px", marginRight: 20 }}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="no_temporary">Job Holder</option>
              <option value="temporary">Temporary</option>
            </select>

            <label htmlFor="startDate" className="form-label">
              Pilih Tanggal Awal
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control ml-3 w-25"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Pilih Tanggal"
            />

            <button
              type="button"
              className="btn btn-dark ml-3"
              onClick={handleSubmit} // Panggil fungsi handleSubmit saat tombol ditekan
            >
              Filter
            </button>

            <button
              type="button"
              className="btn btn-success custom-btn ml-3"
              onClick={
                idCompany !== "33"
                  ? handleDownloadExcelPlatNomor
                  : handleDownloadExcel
              }
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
      <div className="table-responsive" style={{ overflowX: "auto" }}>
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

            .table-bordered th,
            .table-bordered td {
              border: 1px solid #ccc !important;
            }
            .table thead th {
              background-color: #009879;
              color: white;
              text-align: center;
              vertical-align: middle;
            }
            .table tbody td {
              text-align: center;
              vertical-align: middle;
            }
            .table tbody tr:last-of-type {
              border-bottom: 2px solid #009879;
            }
            .sticky-column  {
              border-radius: 15px 0 0 0;
              overflow: hidden;
            }
            .sticky  {
              border-radius: 0 15px  0 0;
              overflow: hidden;
            }
            .table tbody tr:last-of-type {
              border-bottom: 2px solid #009879;
            }
            .sticky-column {
              position: sticky;
              left: 0;
              background-color: #CCE2CB;
              z-index: 3;
            }
          `}
        </style>
        <div className="table-container">
          {loading ? (
            <div className="text-center my-4">Memuat data...</div>
          ) : (
            <table
              className="table table-bordered"
              style={{ width: "100%" }}
              id="table-to-export"
            >
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className="align-middle text-center sticky-column"
                    style={{ width: "200px" }}
                  >
                    Nama
                  </th>
                  <th
                    rowSpan={2}
                    className="align-middle text-center "
                    style={{ width: "200px" }}
                  >
                    Perusahaan
                  </th>
                  {idCompany !== "33" && (
                    <th
                      rowSpan={2}
                      className="align-middle text-center "
                      style={{ width: "200px" }}
                    >
                      Plat Nomor
                    </th>
                  )}

                  <th colSpan={14} className="text-center">
                    <center>Work Hours</center>
                  </th>
                  <th colSpan={2} className="text-center sticky">
                    Total Hours
                  </th>
                </tr>
                <tr>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day, index) => (
                    <th
                      key={index}
                      colSpan={2}
                      className="text-center"
                      style={{ fontSize: "12px" }}
                    >
                      {day} <br /> {dates[index]}
                    </th>
                  ))}
                  <th className="text-center">Work</th>
                  <th className="text-center">Rest</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((driver: any, index) => (
                    <tr key={index}>
                      <td className="align-middle sticky-column">
                        {driver.name}
                      </td>
                      <td className="align-middle sticky-column">
                        {driver.company_names}
                      </td>
                      {idCompany !== "33" &&
                        datanopol?.map((val: any) => {
                          if (val.full_name === driver.name) {
                            return (
                              <td
                                className="align-middle sticky-column"
                                key={driver.plat_nomor}
                              >
                                <a
                                  href={`/admin/customer/costumer-detail/detail-mobil/${val.nopol}`}
                                >
                                  {val.nopol}
                                </a>
                              </td>
                            );
                          }
                          return null; // Mengembalikan null jika kondisi tidak terpenuhi
                        })}

                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day, dayIndex) => (
                        <>
                          <td key={`${day}-masuk`} className="text-center">
                            {driver[day][0]}
                          </td>
                          <td
                            key={`${day}-keluar`}
                            className="text-center"
                            style={{
                              backgroundColor: getExitTimeColor(driver[day][1]),
                            }}
                          >
                            {driver[day][1]}
                          </td>
                        </>
                      ))}
                      <td
                        className="text-center"
                        style={{ backgroundColor: driver.colorCode }}
                      >
                        {driver.totalWorkHours === "00:00"
                          ? "-"
                          : driver.totalWorkHours}
                      </td>
                      <td
                        className="text-center"
                        style={{ backgroundColor: driver.colorCode }}
                      >
                        {driver.totalRestHours === "00:00"
                          ? "-"
                          : driver.totalRestHours}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="align-middle sticky-column text-center"
                      colSpan={17}
                    >
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="pt-4 pb-1 ">
        <Footer />
      </div>
    </section>
  );
};

export default ContentHeader;
