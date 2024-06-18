import React, { useState } from "react";
import axios from "axios";
import DriverReportTable from "./components/Driver_Report_Table";
import * as XLSX from "xlsx";

const apiUrl =
  "https://backend.sigapdriver.com/api/greatday_sigaps_keyence_json";

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
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isNoData, setIsNoData] = useState<boolean>(false);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setIsNoData(false);

    const url = `${apiUrl}/${startDate}/${endDate}/0/33`;
    axios
      .get<ApiResponse>(url)
      .then((response) => {
        setData(response.data.data);
        setIsFiltered(true);
        setIsLoading(false);
        if (response.data.data.length === 0) {
          setIsNoData(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsError(true);
        setIsLoading(false);
      });
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(workbook, "Laporan_Driver.xlsx");
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
        background-color: #007f66; /* Warna yang sedikit lebih gelap untuk efek hover */
        border-color: #007f66;
    } 
        `}
      </style>
      <div className="containern mb-5">
        <h1 className="text-center mb-4 font-weight-bold text-uppercase mb-3 mt-5">
          LAPORAN DRIVER
        </h1>
        <form
          onSubmit={handleSubmit}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="row mb-3">
            <div className="col-md-4">
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
                <option value="">Pilih</option>
                <option value="daily">Job Holder</option>
                <option value="weekly">Temporary</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="startDate" className="form-label">
                Dari Tanggal
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
            <div className="col-md-4">
              <label htmlFor="endDate" className="form-label">
                Sampai Tanggal
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
          <div className="d-grid gap-2 d-md-flex justify-content-md-end ml-3 mt-3">
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
      {isLoading && <p>Sedang memuat...</p>}
      <div className="info-box ">
        {isError && <p>Terjadi kesalahan saat mengambil data.</p>}
        {isNoData && <p>Tidak ada data yang ditemukan.</p>}
        {isFiltered && <DriverReportTable data={data} />}
      </div>
    </>
  );
}

export default LaporanDriver;
