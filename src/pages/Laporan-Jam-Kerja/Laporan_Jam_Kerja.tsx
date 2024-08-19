import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";
import * as XLSX from "xlsx";
import ApiConfig from "@app/libs/Api";
import Footer from "../Footer";

const eventEmitter = new EventEmitter();

interface TableData {
  name: string;
  monday: string[];
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const selectedDate = tglselect || startDate;

      if (!selectedDate) {
        console.error("Selected date is invalid");
        setLoading(false);
        return;
      }

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const getstorage = JSON.parse(userData);
        setIdCompany(getstorage.id_company);
        await fetchDatagreatday(selectedDate, getstorage.id_company);
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
    today.setDate(today.getDate() - 1); // Mundur 1 hari dari hari ini
    let formattedDate = startDate;
    if (!startDate) {
      formattedDate = today.toISOString().split("T")[0];
      setStartDate(formattedDate);
    }

    fetchData();
    calculateDates(formattedDate);

    const handleStorageChange = () => {
      fetchData();
    };

    eventEmitter.on("storageChange", handleStorageChange);

    return () => {
      eventEmitter.off("storageChange", handleStorageChange);
    };
  }, [tglselect, startDate, fetchData]);

  const fetchDatagreatday = async (start: string, idCompany: string) => {
    try {
      const response = await ApiConfig.get(
        `laporan_jam_kerja/${idCompany}/${start}`
      );
      const data = response.data.data;
      console.log("data", data);

      const { drivers, jam_masuk, jam_keluar, awh } = data;

      const formattedData = drivers.map((driver: any) => ({
        name: driver,
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
      }));

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    calculateDates(startDate);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Jam Kerja");
    XLSX.writeFile(workbook, "Laporan_Jam_Kerja.xlsx");
  };

  const calculateColor = (awh: string | undefined) => {
    if (!awh) return "#ffffff";

    const hours = parseInt(awh.split(":")[0]);

    if (hours >= 55) {
      return "#ff8566";
    } else if (hours >= 50 && hours <= 54) {
      return "#ffcc99";
    } else if (hours >= 40 && hours <= 49) {
      return "#ffffb3";
    } else {
      return "#ffffff";
    }
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
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group d-flex align-items-center justify-content-center">
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
              className="btn btn-success custom-btn ml-3"
              onClick={handleDownloadExcel}
            >
              Export Excel
            </button>
          </div>
        </form>
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
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className="align-middle text-center sticky-column"
                    style={{ width: "200px" }}
                  >
                    Nama
                  </th>
                  <th colSpan={14} className="text-center">
                    Work Hours
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
                    <th key={index} colSpan={2} className="text-center">
                      {day} {dates[index]}
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
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].flatMap((day) =>
                        driver[day].map((time: any, idx: any) => (
                          <td key={`${day}-${idx}`} className="text-center">
                            {time}
                          </td>
                        ))
                      )}
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
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default ContentHeader;
