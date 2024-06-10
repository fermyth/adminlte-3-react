import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';

interface DriverApiResponse {
  photo: string;
  full_name: string;
  birthdate: string;
  phone_number: string;
  ktp_address: string;
}

interface DriverData {
  no: number;
  foto: string;
  namaLengkap: string;
  usia: number;
  handphone: string;
  alamatLengkap: string;
}

const Driver: React.FC = () => {
  const [data, setData] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumlahDriver50TahunKeAtas, setJumlahDriver50TahunKeAtas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend.sigapdriver.com/api/getAllDriver?company_info=33');
        const drivers: DriverData[] = response.data.map((driver: DriverApiResponse, index: number): DriverData => ({
          no: index + 1,
          foto: driver.photo || 'https://portal.sigapdriver.com/icon_admin.png',
          namaLengkap: driver.full_name,
          usia: calculateAge(driver.birthdate),
          handphone: driver.phone_number,
          alamatLengkap: driver.ktp_address || '',
        }));
        const jumlahDriver50TahunKeAtas = drivers.filter(driver => driver.usia >= 50).length;

        setData(drivers);
        setJumlahDriver50TahunKeAtas(jumlahDriver50TahunKeAtas);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeColor = (age: number) => {
    if (age >= 50 && age <= 55) {
      return 'orange';
    } else if (age > 55) {
      return 'red';
    } else {
      return 'transparent';
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <style>
        {`
          .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
          }
          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
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
            background-color: #009879;
          }

          #driver50 {
            background-color: #009879;
          }
        `}
      </style>
      <div className="d-flex mt-3 ml-4 mb-3 ">
        <div className="info-box d-flex flex-column align-items-center hover py-4" id="driver">
          <h1 className="font-weight-bold text-uppercase text-light">{data.length}</h1>
          <p className="font-weight-bold text-uppercase text-light">Jumlah Driver</p>
        </div>
        <div className="info-box d-flex flex-column align-items-center hover py-4 ml-4" id="driver50">
          <h1 className="text-light font-weight-bold text-uppercase">{jumlahDriver50TahunKeAtas}</h1>
          <p className="text-light font-weight-bold text-uppercase">Jumlah Driver 50 Tahun Ke atas</p>
        </div>
      </div>
      <div className="container">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#009879", color: "white" }}>No</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#009879", color: "white" }}>Foto</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#009879", color: "white" }}>Nama Lengkap</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#009879", color: "white" }}>Usia</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#009879", color: "white" }}>Nomor Handphone</th>
                <th scope="col" className="text-center align-middle nowrap" style={{ backgroundColor: "#009879", color: "white" }}>Alamat Lengkap</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center">{error}</td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.no}>
                    <th scope="row" className="text-center align-middle nowrap">{item.no}</th>
                    <td className="text-center align-middle nowrap">
                      <img src={item.foto} alt="Foto" className="img-fluid" style={{ width: '50px', height: '50px' }} />
                    </td>
                    <td className="text-center align-middle nowrap">{item.namaLengkap}</td>
                    <td className="text-center align-middle nowrap" style={{ fontWeight: 'bold', color: getAgeColor(item.usia) }}>{item.usia}</td>
                    <td className="text-center align-middle nowrap">{item.handphone}</td>
                    <td className="align-middle nowrap">{item.alamatLengkap}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="d-flex justify-content-center pb-4">
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              <Pagination.Item>{currentPage}</Pagination.Item>
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={indexOfLastItem >= data.length} />
            </Pagination>
          </div>
        </div>
      </div>
    </>
  );
};

export default Driver;
