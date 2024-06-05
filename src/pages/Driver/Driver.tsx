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
                .hover{
                    transition: all 0.3s ease;
                }

                .hover:hover {
                    transform: scale(1.1);
                }

                #driver {
                    width: 30%;
                    background-color: #53cdfc;
                    border-radius: 5px;
                    cursor: pointer;
                }

                #driver50 {
                    width: 30%;
                    background-color: #3acf87;
                    border-radius: 5px;
                    cursor: pointer;
                }
                `}
            </style>
            <div className="d-flex mt-3  ml-4">
                <div className="info-box hover  py-4 d-flex flex-column justify-content-center align-items-center" 
                     id="driver"
                >
                    <h1 className="font-weight-bold text-uppercase">17 </h1>
                    <p className="font-weight-bold text-uppercase">Jumlah Driver</p>
                </div>
                <div className="info-box hover py-4 ml-4 d-flex flex-column justify-content-center align-items-center" 
                     id="driver50"
                >
                    <h1 className="text-black font-weight-bold text-uppercase">7 </h1>
                    <p className="text-black font-weight-bold text-uppercase">Jumlah Driver 50 Tahun Ke atas</p>
                </div>
            </div>
            <div className='info-box d-flex flex-column '>
            <div className=' w-100 d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center '>
                    <h3 className="ml-4 " style={{ fontSize: "15px", fontWeight: "300", color: "black", cursor: "pointer"  }}>Show</h3>
                <div className="ml-2">
                    <select className="form-select" id="type"  style={{ width: '100px' }}  >
                      <option value="">Pilih</option>
                      <option value="daily">Harian</option>
                      <option value="weekly">Mingguan</option>
                      <option value="monthly">Bulanan</option>
                    </select>
                </div>
                    <h3 className="ml-2 " style={{ fontSize: "15px", fontWeight: "300", color: "black", cursor: "pointer"  }}>entris</h3>
                </div>
                <div className='d-flex align-items-center mr-4 '>
                    <label htmlFor="search"> Search:</label>
                    <input type="text" id="search" className="form-control ml-2 " />
                </div>
            </div>  
             <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Foto</th>
            <th scope="col">Nama Lengkap</th>
            <th scope="col">Usia</th>
            <th scope="col">Nomor Handphone</th>
            <th scope="col">Alamat Lengkap</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{item.no}</th>
              <td>
                <img src={item.foto} alt="Foto" className="img-fluid" style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{item.namaLengkap}</td>
              <td>{item.usia}</td>
              <td>{item.handphone}</td>
              <td>{item.alamatLengkap}</td>
            </tr>
          ))}
        </tbody>
      </table>
            </div>
            
        </>
    )
};

export default Driver;