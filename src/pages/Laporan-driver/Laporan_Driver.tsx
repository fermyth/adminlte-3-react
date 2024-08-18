import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "events";
import DriverReportTable from "./components/Driver_Report_Table";
import * as XLSX from "xlsx";
import ApiConfig, { UrlServer } from "@app/libs/Api";
import Footer from "../Footer";


const eventEmitter = new EventEmitter();
const apiUrl = UrlServer() + '/laporan_driver';

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
      setIsLoading(true);
      setIsError(false);
      setIsNoData(false);

      try {
        const response = await axios.get<ApiResponse>(url);
        //console.log("nanananan", response.data.data);

        setData(response.data.data);
        setIsFiltered(true);
        if (response.data.data.length === 0) {
          setIsNoData(true);
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
          background-color: #007f66;
          border-color: #007f66;
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
                <option value="">Pilih</option>
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
        {isLoading && <p>Sedang memuat...</p>}
        {isNoData && <p>Tidak ada data yang ditemukan.</p>}
        {isError && data.length === 0 && <p>Sedang memuat...</p>}
      </center>
      <div className="info-box">
        {isFiltered && <DriverReportTable data={data} />}
      </div>
      <div>
        <Footer/>
      </div>
    </>
  );
}

export default LaporanDriver;
