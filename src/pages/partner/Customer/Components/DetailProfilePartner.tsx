import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
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

const DetailProfilePartner: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DriverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumlahDriver50TahunKeAtas, setJumlahDriver50TahunKeAtas] = useState(0);
  const [id, setid] = useState(null);
  const [namadirver, setnamadriver] = useState(null);
  const [photo, setphoto] = useState(null);
  const [alamat, setalamat] = useState(null);
  const [no_hp, setno_hp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const storagedriver = localStorage.getItem('getdatadriverpartner');
        if (storagedriver) {
          const datstorage = JSON.parse(storagedriver);
          console.log('cekprofilpartnerdriver',datstorage)
          setid(datstorage.id);
          setphoto(datstorage.photo);
          setnamadriver(datstorage.nama_lengkap);
          setalamat(datstorage.alamat);
          setno_hp(datstorage.no_hp);
        }
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
      }

      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const { id_company } = JSON.parse(userData);
          setIdCompany(id_company);
        } else {
          setIdCompany(null);
        }
      } catch (error) {
        console.error('Error fetching userData from AsyncStorage:', error);
        setError("Gagal mengambil data");
      } finally {
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
    return "http://operation.sigapps.com/"+photoAddress;
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
            max-width: 1300px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          .button-container {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 20px;
          }
  
          .back-button {

            color: #009879;
            border: none;
            border-radius: 50%;
            padding: 10px;
            cursor: pointer;
            font-size: 20px;
            
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
          }
  
          .back-button:hover {
            background-color: white;
          }
  
          .profile-section {
            display: flex;
            align-items: center;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
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
  
          .experience-section,
          .skills-section {
            margin-bottom: 30px;
          }
  
          .experience-table,
          .skills-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 20px;
            border-radius: 8px; /* Border radius untuk tabel */
            overflow: hidden; /* Untuk menghindari radius mempengaruhi garis tabel */
          }
  
          .experience-table th,
          .experience-table td,
          .skills-table th,
          .skills-table td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }
  
          .experience-table th {
            background-color: #009879;
            color: white;
            font-weight: bold;
            text-align: center;
          }
  
          .skills-table th {
            background-color: #f2f2f2;
            color: #333;
            font-weight: bold;
            text-align: center;
          }
  
          .experience-table tbody tr:nth-child(even),
          .skills-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
  
          .experience-table tbody tr:hover,
          .skills-table tbody tr:hover {
            background-color: #e0e0e0;
            cursor: pointer;
          }
        `}
      </style>
  
      <div className="button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
      </div>
  
      <div className="profile-section">
       <img
  src={`http://operation.sigapps.com/${photo}`}
  className="profile-img"
  alt="Profile"
/>
        <div className="profile-details">
          <h2>Profil Driver</h2>
          <div className="profile-info">
            <p><strong>ID Pegawai:</strong> {id}</p>
            <p><strong>Nama:</strong> {namadirver}</p>
            <p><strong>Alamat:</strong> {alamat}</p>
            <p><strong>Nomor Telepon:</strong> {no_hp}</p>
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

export default DetailProfilePartner;
