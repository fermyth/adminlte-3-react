import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "react-bootstrap";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const DetailCustomerMobil: React.FC = () => {
  const [data, setData] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumlahDriver50TahunKeAtas, setJumlahDriver50TahunKeAtas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const { id_company } = JSON.parse(userData);
          setIdCompany(id_company);
        } else {
          setIdCompany(null);
        }
        setIsLoading(false);
      } catch (error) {
        setError("Gagal mengambil data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const getDataDriver = async () => {
      if (!idCompany) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://backend.sigapdriver.com/api/getAllDriver?company_info=${idCompany}`
        );

        if (response && response.data && response.data.data) {
          const drivers: DriverData[] = response.data.data.map(
            (driver: DriverApiResponse, index: number): DriverData => ({
              no: index + 1,
              foto: viewPhoto(driver.photo),
              namaLengkap: driver.full_name,
              usia: calculateAge(driver.birthdate),
              handphone: driver.phone_number,
              alamatLengkap: driver.ktp_address || "",
            })
          );

          const jumlahDriverDiAtas50Tahun = drivers.filter(
            (driver) => driver.usia >= 51
          ).length;

          setData(drivers);
          setJumlahDriver50TahunKeAtas(jumlahDriverDiAtas50Tahun);
          setIsLoading(false);
        }
      } catch (err) {
        setError("Gagal mengambil data pengemudi");
        setIsLoading(false);
      }
    };

    getDataDriver();
  }, [idCompany]);

  const viewPhoto = (photoAddress: string | null) => {
    if (!photoAddress || photoAddress.indexOf("ttp") < 0) {
      return "https://portal.sigapdriver.com/icon_admin.png";
    }
    return "http://operation.sigapps.com/" + photoAddress;
  };

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
    if (age >= 51 && age <= 55) {
      return "orange";
    } else if (age > 55) {
      return "red";
    } else {
      return "black";
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const itemsPerPage = 20;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <>
      <style>
        {`
          <style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
  }

  /* Perubahan header */
  .container {
    max-width: 1200px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
  }

  .car-info {
    flex: 1;
    margin-right: 20px;
  }

  .car-info img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 4px;
  }

  .specs {
    flex: 1;
    padding: 0 20px;
  }

  .specs h2 {
    margin-top: 0;
  }

  .specs ul {
    list-style-type: none;
    padding: 0;
  }

  .specs ul li {
    margin-bottom: 8px;
    line-height: 1.6;
  }

  /* Perubahan untuk tabel */
  .table-container {
    flex: 1 0 100%;
    margin-top: 20px; /* Diberikan jarak atas 20px */
  }

  .table-container h2 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  table th,
  table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  
  }

  table th {
    background-color: #ffff; /* Warna latar header tabel */
    color: #ffff; /* Warna teks header tabel */
    font-weight: bold;
  }

  table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
    color 
  }

  table tbody tr:hover {
    background-color: #009879;
    color: #ffff;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .container {
      padding: 10px;
    }

    .specs,
    .table-container {
      flex: 1 0 100%;
      margin-bottom: 0;
    }
  }
    .skills-section {
    margin-bottom: 20px; /* Jarak bawah untuk memisahkan dengan elemen berikutnya */
  }
        .table skills-table {
        


        }
   


            
        `}
      </style>
      
      <div className="container">
        <div className="car-info">
          <img src="https://imgcdn.oto.com/large/gallery/exterior/14/2435/honda-hr-v-2022-front-angle-low-view-753385.jpg" alt="Car Image" />
        </div>
        <div className="specs">
        <h2>Riwayat Uji Emisi</h2>
       <div className="table-container">
    <table style={{fontSize:13.5}} className="table table-sm" >
      <tr>
        <td><strong>Tipe Kendaraan:</strong></td>
        <td>HRV</td>
      </tr>
      <tr>
        <td><strong>Pembuat:</strong></td>
        <td>Honda</td>
      </tr>
      <tr>
        <td><strong>Tahun:</strong></td>
        <td>2023</td>
      </tr>
      <tr>
        <td><strong>Warna Kendaraan:</strong></td>
        <td>Merah</td>
      </tr>
      <tr>
        <td><strong>Nomor Polisi:</strong></td>
        <td>B-2312</td>
      </tr>
      <tr>
        <td><strong>Nomor Rangka:</strong></td>
        <td>MWHWGWG2312</td>
      </tr>
      <tr>
        <td><strong>Nomor Mesin:</strong></td>
        <td>L123</td>
      </tr>
      <tr>
        <td><strong>Pilihan (Aksesoris):</strong></td>
        <td>NIL</td>
      </tr>
      <tr>
        <td><strong>Jangka Waktu Sewa:</strong></td>
        <td>48 bulan</td>
      </tr>
      <tr>
        <td><strong>Biaya Sewa :</strong></td>
        <td>Rp. 8.320.000</td>
      </tr>
    </table>
  </div>
</div>

        <div className="table-container">
          <h2>Riwayat Uji Emisi</h2>
          <table>
            <tbody>
              <tr>
                <td><strong>Tanggal:</strong></td>
                <td><strong>Lokasi:</strong></td>
                <td><strong>Status:</strong></td>             
              </tr>
              <tr>
              <td>23 Juli 2022</td>
              <td>Jakarta</td>
              <td>Lulus</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div className="table-container">
          <h2>Riwayat Servis Kendaraan</h2>
          <table>
            <tbody>
              <tr>
                <td><strong>KM</strong></td>
                <td><strong>Lokasi</strong></td>
                <td><strong>Servis</strong></td>
                <td><strong>Keterangan</strong></td>
              </tr>
              <tr>
              <td>23000</td>
                <td>Jakarta</td>
                <td>Perbaikan Mesin</td>
                <td>Sedang diperbaiki</td>
              </tr> 
            </tbody>
          </table>
        </div>      
        <br></br>
        <div className="table-container" style={{marginTop:20}}>
        <h2>Riwayat kecelakaan</h2>
        <table className="skills-table">
            <tbody>
              <tr>
                <td><strong>Tanggal</strong></td>
                <td><strong>Lokasi Kecelakaan</strong></td>
                <td><strong>Keterangan</strong></td>
              </tr>
              <tr>
              <td>05 Juli 2022</td>
                <td>Jakarta</td>
                <td>Mobil Rusak</td>
              </tr> 
            </tbody>
          </table>
      </div>
      </div>
    </>
  );
};

export default DetailCustomerMobil;
