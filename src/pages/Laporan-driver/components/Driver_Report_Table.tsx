import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalKlaim from './Modal_Klaim';

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

interface DriverReportTableProps {
  data: DriverData[];
}

const DriverReportTable: React.FC<DriverReportTableProps> = ({ data }) => {
  const allDates = Array.from(new Set(data.flatMap(item => Object.keys(item.timesheet))));

  return (
    <div className="table-responsive" >
      <style>
        {`
          .header-row {
            background-color: rgb(4, 170, 109);
            color: white;
          }
          .sub-header-row {
            background-color: #138732;
            color: white;
            font-weight: bold;
          }
          .table-hover tbody tr:hover {
            background-color: rgba(0, 0, 0, 0.075);
          }
          .btn-custom {
            background-color: #ffc107;
            color: black;
          }
          .btn-custom:hover {
            background-color: #e0a800;
          }
          th, td {
            white-space: nowrap;
          }
          .table-bordered th,
          .table-bordered td {
            border: 1px solid #ACE1AF !important;
          }
          .sticky-column {
            position: sticky;
            left: 0;
            background-color: #CCE2CB;
            z-index: 2;
          }
        
          .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
            
        `}
      </style>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="header-row">
            <th colSpan={allDates.length * 10 + 1} className="text-center " style={{ backgroundColor: "#009879", color: "white" }}>
              Laporan Driver: {allDates.join(' - ')}
            </th>
          </tr>
          <tr className="sub-header-row text-center">
            <th rowSpan={2} style={{ backgroundColor: "#009879", color: "white" }} className="sticky-column">Nama</th>
            {allDates.map(date => (
              <React.Fragment key={date}>
                <th style={{ backgroundColor: "#009879", color: "white" }}>Jam Masuk</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>Jam Keluar</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>KM IN</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>KM OUT</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>LK PP</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>LK INAP</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>Images Km In</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>Images Km Out</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>Nama Users</th>
                <th style={{ backgroundColor: "#009879", color: "white" }}>Laporan Opsi Detail</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="sticky-column">{item.nama}</td>
              {allDates.map(date => {
                const timesheet = item.timesheet[date];
                return timesheet ? (
                  <React.Fragment key={date}>
                    <td className="text-center">{timesheet.jam_masuk}</td>
                    <td className="text-center">{timesheet.jam_keluar}</td>
                    <td className="text-center">{timesheet.km_in}</td>
                    <td className="text-center">{timesheet.km_out}</td>
                    <td className="text-center">{timesheet.lk_pp}</td>
                    <td className="text-center">{timesheet.lk_inap}</td>
                    <td className="text-center">
                      <img src={`https://backend.sigapdriver.com/storage/${timesheet.km_in_images || ''}`} alt="Km In" className="img-fluid" style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td className="text-center">
                      <img src={`https://backend.sigapdriver.com/storage/${timesheet.km_out_images || ''}`} alt="Km Out" className="img-fluid" style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td className="text-center">{timesheet.name_users}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <ModalKlaim />
                        <button className="btn btn-custom btn-sm">Activity</button>
                      </div>
                    </td>
                  </React.Fragment>
                ) : (
                  <React.Fragment key={date}>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverReportTable;
