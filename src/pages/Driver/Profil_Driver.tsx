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

const ProfilDriver: React.FC = () => {
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
    <div className="container">
      <style>
        {`
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 900px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .profile-section {
            display: flex;
            align-items: center;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #ffffff; /* Warna latar belakang untuk card profil */
            margin-bottom: 20px;
          }

          .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 4px solid #009879;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .profile-details {
            flex: 1;
            margin-left: 20px;
          }

          .profile-details h2 {
            margin: 5px 0;
            font-size: 24px;
            color: #333;
            text-transform: uppercase;
          }

          .profile-details p {
            margin: 5px 0;
            font-size: 16px;
            color: #666;
            line-height: 1.6;
          }

          .profile-details p strong {
            color: #333;
          }
          .experience-section {
            margin-bottom: 30px;
          }

          .experience-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .experience-table th,
          .experience-table td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }

          .experience-table th {
            background-color: #009879;
            color: #333;
            font-weight: bold;
            text-align: center;
           }
            .experience-section .experience-table th {
            color: white; 
           }

          .experience-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
            color
          }

          .experience-table tbody tr:hover {
            background-color: #e0e0e0;
            cursor: pointer;
          }

          .skills-section {
            margin-bottom: 30px;
          }

          .skills-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .skills-table th,
          .skills-table td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }

          .skills-table th {
            background-color: #f2f2f2;
            color: #333;
            font-weight: bold;
            text-align: center;
          }

          .skills-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .skills-table tbody tr:hover {
            background-color: #e0e0e0;
            cursor: pointer;
          }
        `}
      </style>

      <div className="profile-section">
        <img
          src="https://via.placeholder.com/150"
          className="profile-img"
          alt="Profile"
        />
        <div className="profile-details">
          <h2>Profil Driver</h2>
          <div className="profile-info">
            <p><strong>ID Pegawai: </strong> 2312875</p>
            <p><strong>Nama:</strong> Bar</p>
            <p><strong>Alamat:</strong> Kota Sukabumi</p>
            <p><strong>Nomor Telepon:</strong> 0834728292929</p>
          </div>
        </div>
      </div>

      <div className="experience-section">
        <h2>Pengalaman</h2>
        <table className="experience-table">
          <thead>
            <tr>
              <th>Tahun</th>
              <th>Perusahaan</th>
              <th>Jabatan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2014 - 2015</td>
              <td>PT Keyence</td>
              <td>Driver User</td>
            </tr>
            <tr>
              <td>2016 - 2017</td>
              <td>PT Epson</td>
              <td>Driver User</td>
            </tr>
            {/* Tambahkan baris lain sesuai kebutuhan */}
          </tbody>
        </table>
      </div>

      <div className="skills-section">
        <h2>Keahlian</h2>
        <table className="skills-table">
          <tbody>
            <tr>
              <td>2019 Lulus training lalu lintas</td>
            </tr>
            {/* Tambahkan baris lain sesuai kebutuhan */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilDriver;