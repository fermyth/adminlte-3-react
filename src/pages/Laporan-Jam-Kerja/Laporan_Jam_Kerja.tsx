import React, { useEffect, useState } from "react";
import axios from "axios";

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
}

const tableData: TableData = {
  name: "Otong Suryana",
  monday: ["06:00", "22:23"],
  tuesday: ["06:00", "22:23"],
  wednesday: ["06:06", "21:07"],
  thursday: ["06:06", "21:07"],
  friday: ["06:06", "06:06"],
  saturday: ["06:06", "06:06"],
  sunday: ["06:06", "06:06"],
  totalWorkHours: "43:45",
  totalRestHours: "05:15",
};

const LaporanJamKerja = ({ title }: { title: string }) => {
  const [data, setData] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [namadriver, setNamaDriver] = useState(null);
  const [humanDay, sethumanDay] = useState(null);
  const [human_date, sethuman_date] = useState(null);
  const [drivers, setdrivers] = useState(null);
  const [jam_masuk, setjam_masuk] = useState(null);
  const [jam_keluar, setjam_keluar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend.sigapdriver.com/api/greatdayinout/2024-06-05/33"
        );
        console.log("cekdata", response.data.data);
        setNamaDriver(response.data.data.drivers);
        sethumanDay(response.data.data.human_day);
        sethuman_date(response.data.data.human_date);
        setdrivers(response.data.data.drivers);
        setjam_masuk(response.data.data.jam_masuk);
        setjam_keluar(response.data.data.jam_keluar);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="container my-4">
      <div className="text-center mb-4">
        <h1 className="font-weight-bold text-uppercase">{title}</h1>
        <p className="font-weight-bold text-uppercase">
          2024/06/03 - 2024/06/09
        </p>
      </div>
      <div className="mb-5 w-100 form-wrapper">
        <form action="" className="form-container">
          <div className="form-group d-flex align-items-center justify-content-center">
            <label htmlFor="startDate" className="form-label">
              Pilih Tanggal Awal
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control ml-3 w-25"
              placeholder="Pilih Tanggal"
            />
            <button type="submit" className="btn btn-primary ml-3">
              Pilih Tanggal
            </button>
            <button type="submit" className="btn btn-success ml-3">
              Export Excel
            </button>
          </div>
        </form>
      </div>
      <div className="table-responsive">
        <style>
          {`
            
            .table-container {
              border-radius:  15px 15px 0 0;
              border-top: 1px solid #009879;
              border-top: none;
              overflow: hidden;
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
              background-color: white !important;
            }
            .table tbody tr:last-of-type {
               border-bottom: 2px solid #009879;
            }
          `}
        </style>

        <div className="table-container">
          {isLoading ? (
            <h3>Loading</h3>
          ) : (
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className="align-middle text-center"
                    style={{ width: "200px" }}
                  >
                    Nama
                  </th>
                  <th colSpan={14} className="text-center">
                    Work Hours
                  </th>
                  <th
                    colSpan={2}
                    className="text-center"
                    style={{ verticalAlign: "middle" }}
                  >
                    Total AWH
                  </th>
                </tr>
                <tr>
                  {humanDay.map((day, index) => (
                    <th
                      key={`day-${index}`}
                      className="text-middle"
                      colSpan="2"
                    >
                      {day}
                      <br /> {human_date[index]}
                    </th>
                  ))}
                  <th
                    className="text-center"
                    style={{ verticalAlign: "middle" }}
                  >
                    Work
                  </th>
                  <th
                    className="text-center"
                    style={{ verticalAlign: "middle" }}
                  >
                    Rest
                  </th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => {
                  const nama = driver;

                  return (
                    <tr key={`row-${index}`}>
                      <td className="text-center">{nama}</td>
                      {/* {jam_masuk[driver].map((jam, jIndex) => ( */}
                        <td
                          // key={`time-${index}-${jIndex}`}
                          className="text-middle"
                          colSpan="2"
                        >
                          {/* {GeneralHelper.numberBeauty(jam)} |{" "}
                          {GeneralHelper.numberBeauty(
                            jam_keluar[driver][jIndex]
                          )} */}
                        </td>
                      {/* ))} */}
                      <td
                        className="text-middle"
                        // style={{ backgroundColor: color_code[driver] }}
                      >
                        {/* {awh[driver].substring(0, 5)} */}
                      </td>
                      <td
                        className="text-middle"
                        // style={{ backgroundColor: color_code[driver] }}
                      >
                        {/* {awh[driver].substring(9, 5)} */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default LaporanJamKerja;
