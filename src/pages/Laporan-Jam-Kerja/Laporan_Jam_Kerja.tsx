import axios from "axios";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [tglselect, settglselect] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        let tgl_sekarang = tglselect || startDate;

        const userData = await AsyncStorage.getItem("userData");

        if (userData) {
          const getstorage = JSON.parse(userData);
          setIdCompany(getstorage.id_company);
          await fetchDatagreatday(tgl_sekarang, getstorage.id_company);
        } else {
          setIdCompany(null);
        }
      } catch (error) {
        console.error("Error fetching id_company from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const today = new Date();
    let formattedDate = startDate;
    if (!startDate) {
      formattedDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
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
  }, [tglselect, startDate]); // tambahkan startDate sebagai dependensi

  const fetchDatagreatday = async (start: string, idCompany: string) => {
    try {
      const response = await axios.get(
        `https://backend.sigapdriver.com/api/greatdayinout/${start}/${idCompany}`
      );
      const data = response.data.data;
      const { drivers, jam_masuk, jam_keluar, awh, color_code } = data;

      const formattedData = drivers.map((driver: string) => ({
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
        totalWorkHours: awh[driver].split(" || ")[0],
        totalRestHours: awh[driver].split(" || ")[1],
        colorCode: color_code[driver],
      }));

      setTableData(formattedData);
    } catch (error) {
      console.log("Error fetching data from API:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    if (typeof time !== "string" || !time.trim()) {
      return "-"; // Return default value if time is not a non-empty string
    }

    const [hours, minutes] = time.split(":");
    if (hours && minutes) {
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    } else {
      return "-"; // Return default value if time format is incorrect
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

  return (
    <section className="containers" style={{ padding: 20 }}>
      <div className="text-center mb-4">
        <h1 className="font-weight-bold text-uppercase">Laporan Jam Kerja</h1>
        <p className="font-weight-bold text-uppercase">
          {startDate ? `${dates[0]} - ${dates[6]}` : "Pilih Tanggal"}
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
            <button type="submit" className="btn btn-dark ml-3">
              Pilih Tanggal
            </button>
            <button
              type="button"
              className="btn btn-success custom-btn ml-3"
              onClick={() =>
                alert("Export to Excel feature is not implemented yet.")
              }
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
          {isLoading ? (
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
                  tableData.map((driver, index) => (
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
                        driver[day].map((time, idx) => (
                          <td key={`${day}-${idx}`} className="text-center">
                            {formatTime(time)}
                          </td>
                        ))
                      )}
                      <td
                        className="text-center"
                        style={{ backgroundColor: driver.colorCode }}
                      >
                        {driver.totalWorkHours}
                      </td>
                      <td
                        className="text-center"
                        style={{ backgroundColor: driver.colorCode }}
                      >
                        {driver.totalRestHours}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="align-middle sticky-column text-center"
                      colSpan={17}
                    >
                      Memuat data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentHeader;
