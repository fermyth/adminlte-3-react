import React from 'react';

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
          .table-bordered th,
          .table-bordered td {
            border: 1px solid #D1D8C5!important;
          }
        `}
      </style>
      <table className="table table-bordered border-dark">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#138732' }}></th>
            <th colSpan={11} className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>Wednesday 05 Jun 2024</th>
          </tr>
          <tr>
            <th className="text-center" style={{ backgroundColor: '#138732',  color: 'white', fontWeight: 'bold' }}>Nama</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>Jam Masuk</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>Jam Keluar</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>KM IN</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>KM OUT</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>LK PP</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>LK INAP</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>Images Km In</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>Images Km Out</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>Nama Users</th>
            <th className="text-center text-white" style={{ backgroundColor: 'rgb(4,170,109)' }}>Opsi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td  style={{ backgroundColor: '#138732', color: 'white', fontWeight: 'bold' }}>{item.nama}</td>
              <td>{item.jamMasuk}</td>
              <td>{item.jamKeluar}</td>
              <td>{item.kmIn}</td>
              <td>{item.kmOut}</td>
              <td>{item.lk}</td>
              <td>{item.status}</td>
              <td>{item.status}</td>
              <td>{item.status}</td>
              <td>{item.status}</td>
              <td>
                <button className="btn btn-warning btn-sm">Detail</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DriverReportTable;
