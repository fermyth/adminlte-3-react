import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import Select from "react-select";
import { date } from "yup";
import ApiConfig from "@app/libs/Api";

const Laporan_jam_kerja_internal: React.FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [masterCompanies, setMasterCompanies] = useState<MasterCompany[]>([]);

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
    colorCode: string[];
  }

  interface MasterCompany {
    id: string;
    company_name: string;
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (!startDate || !idCompany) {
        console.error("Selected date or company is invalid");
        setLoading(false);
        return;
      }

      await fetchDatagreatday(startDate, idCompany);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, idCompany]);

  useEffect(() => {
    const today = new Date();
    let formattedDate = startDate;
    if (!startDate) {
      formattedDate = today.toISOString().split("T")[0];
      setStartDate(formattedDate);
    }

    fetchMasterCompanies();
  }, []);

  const fetchMasterCompanies = async () => {
    try {
      const response = await ApiConfig.get("companies");
      setMasterCompanies(response.data.data);
    } catch (error) {
      console.error("Error fetching master companies:", error);
    }
  };

  const handleCompanyChange = (selectedOption: any) => {
    setIdCompany(selectedOption ? selectedOption.value : null);
  };

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
    fetchData();
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

  const companyOptions = masterCompanies.map((company) => ({
    value: company.id,
    label: company.company_name,
  }));

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
            <Select
              className="ml-3 w-25"
              options={companyOptions}
              onChange={handleCompanyChange}
              isClearable
              placeholder="Pilih Perusahaan"
            />
            <button type="submit" className="btn btn-dark ml-3">
              Filter
            </button>
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
              background-color: #007f6c;
              border-color: #007f6c;
            }
              .table-bordered {
      border-radius: 10px;
      overflow: hidden;
    }

    .table-bordered th:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px 0;
    }

    .table-bordered th:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px 0;
    }
          `}
        </style>
        <table className="table table-bordered table-striped table-hover">
          <thead className="">
            <tr>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
                className="align-middle sticky-top"
              >
                Driver
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Senin <br />
                {dates[0]}
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Selasa <br />
                {dates[1]}
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Rabu <br />
                {dates[2]}
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Kamis
                <br />
                {dates[3]}
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Jumat
                <br />
                {dates[4]}
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Sabtu
                <br />
                {dates[5]}
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Minggu <br />
                {dates[6]}
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
                className="align-middle "
              >
                Total Jam Kerja
              </th>
              <th
                scope="col"
                style={{
                  backgroundColor: "#009879",
                  color: "white",
                  textAlign: "center",
                }}
                className="align-middle "
              >
                Total Jam Istirahat
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index}>
                <td className="align-middle" style={{ textAlign: "center" }}>
                  {data.name}
                </td>
                <td className="align-middle">
                  {data.monday[0]} - {data.monday[1]}
                </td>
                <td className="align-middle">
                  {data.tuesday[0]} - {data.tuesday[1]}
                </td>
                <td className="align-middle">
                  {data.wednesday[0]} - {data.wednesday[1]}
                </td>
                <td className="align-middle">
                  {data.thursday[0]} - {data.thursday[1]}
                </td>
                <td className="align-middle">
                  {data.friday[0]} - {data.friday[1]}
                </td>
                <td className="align-middle">
                  {data.saturday[0]} - {data.saturday[1]}
                </td>
                <td className="align-middle">
                  {data.sunday[0]} - {data.sunday[1]}
                </td>
                <td
                  className="align-middle"
                  style={{
                    textAlign: "center",
                    backgroundColor: data.colorCode,
                  }}
                >
                  {data.totalWorkHours}
                </td>
                <td
                  className="align-middle"
                  style={{
                    textAlign: "center",
                    backgroundColor: data.colorCode,
                  }}
                >
                  {data.totalRestHours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Laporan_jam_kerja_internal;
