import React from 'react';

const Driver = () => {
  const data = [
    {
      no: 1,
      foto: 'https://portal.sigapdriver.com/icon_admin.png',
      namaLengkap: 'Ahmad Ridwan',
      usia: 43,
      handphone: '087878792029',
      alamatLengkap: 'Jl. Hj Mawi Gg Serius No. 48 Kel. Waru Induk Kec. Parung Bogor',
    },
    {
      no: 2,
      foto: 'https://portal.sigapdriver.com/icon_admin.png',
      namaLengkap: 'Anis Tangahu',
      usia: 52,
      handphone: '081286072624',
      alamatLengkap: 'Jl. Rawa Papan RT/RW. 006/006, Kelurahan Bintaro, Kecamatan Pesanggrahan, Jakarta Selatan',
    },
  ];

  return (
    <>
      <style>
        {`
          .hover {
            transition: all 0.3s ease;
          }

          .hover:hover {
            transform: scale(1.1);
          }

          #driver, #driver50 {
            width: 30%;
            border-radius: 5px;
            cursor: pointer;
          }

          #driver {
            background-color: #6DC5D1;
          }

          #driver50 {
            background-color: #ACE1AF;
          }

          .nowrap {
            white-space: nowrap;
          }

          .table td, .table th {
            padding: 8px;
            vertical-align: middle;
          }
          .table-responsive {
            margin-top: 1rem;
          }
          .table-bordered th,
          .table-bordered td {
            border: 1px solid #ACE1AF !important;
          }
        `}
      </style>
      <div className="d-flex mt-3 ml-4 ">
        <div className="info-box d-flex flex-column align-items-center hover   py-4" id="driver">
          <h1 className="font-weight-bold text-uppercase">17</h1>
          <p className="font-weight-bold text-uppercase">Jumlah Driver</p>
        </div>
        <div className="info-box d-flex flex-column align-items-center hover py-4 ml-4" id="driver50">
          <h1 className="text-black font-weight-bold text-uppercase">7</h1>
          <p className="text-black font-weight-bold text-uppercase">Jumlah Driver 50 Tahun Ke atas</p>
        </div>
      </div>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <h3 className="mr-2" style={{ fontSize: "15px", fontWeight: "300", color: "black" }}>Show</h3>
            <select className="form-select mr-2" id="type" style={{ width: '150px' }}>
              <option value="">Pilih</option>
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
            </select>
            <h3 style={{ fontSize: "15px", fontWeight: "300", color: "black" }}>entris</h3>
          </div>
          <div className="d-flex align-items-center">
            <label htmlFor="search" className="mr-2">Search:</label>
            <input type="text" id="search" className="form-control" />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#ACE1AF" }}>No</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#ACE1AF" }}>Foto</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#ACE1AF" }}>Nama Lengkap</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#ACE1AF" }}>Usia</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#ACE1AF" }}>Nomor Handphone</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#ACE1AF" }}>Alamat Lengkap</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <th scope="row" className="text-center align-middle nowrap">{item.no}</th>
                  <td className="text-center align-middle nowrap">
                    <img src={item.foto} alt="Foto" className="img-fluid" style={{ width: '50px', height: '50px' }} />
                  </td>
                  <td className="text-center align-middle nowrap">{item.namaLengkap}</td>
                  <td className="text-center align-middle nowrap">{item.usia}</td>
                  <td className="text-center align-middle nowrap">{item.handphone}</td>
                  <td className="align-middle nowrap">{item.alamatLengkap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Driver;
