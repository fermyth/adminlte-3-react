import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModalKlaim from './Modal_Klaim';

function DriverReportTable() {
  const data = [
    {
      nama: 'Ahmad Ridwan',
      jamMasuk: '08:00',
      jamKeluar: '17:00',
      kmIn: 100,
      kmOut: 200,
      lk: 100,
      status: 'Active',
    },
    {
      nama: 'Anis Tangahu',
      jamMasuk: '09:00',
      jamKeluar: '18:00',
      kmIn: 150,
      kmOut: 250,
      lk: 150,
      status: 'Inactive',
    },
  ];

  return (
    <div className="table-responsive">
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
            z-index: 1;
          }
          .sticky-header {
            position: sticky;
            top: 0;
            z-index: 2;
            background-color: #CCE2CB;
          }
        `}
      </style>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="header-row">
            <th colSpan={11} className="text-center sticky-header"  style={{ backgroundColor: "#ACE1AF" }}>Wednesday 05 Jun 2024</th>
          </tr>
          <tr className="sub-header-row text-center">
            <th  style={{ backgroundColor: "#ACE1AF" }} className="sticky-column" >Nama</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >Jam Masuk</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >Jam Keluar</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >KM IN</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >KM OUT</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >LK PP</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >LK INAP</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >Images Km In</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >Images Km Out</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >Nama Users</th>
            <th  style={{ backgroundColor: "#ACE1AF" }} >Laporan Opsi Detail</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="sticky-column">{item.nama}</td>
              <td className="text-center">{item.jamMasuk}</td>
              <td className="text-center">{item.jamKeluar}</td>
              <td className="text-center">{item.kmIn}</td>
              <td className="text-center">{item.kmOut}</td>
              <td className="text-center">{item.lk}</td>
              <td className="text-center">{item.status}</td>
              <td className="text-center">{item.status}</td>
              <td className="text-center">{item.status}</td>
              <td className="text-center">{item.status}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <ModalKlaim/>
                  <button className="btn btn-custom btn-sm">Activity</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DriverReportTable;
