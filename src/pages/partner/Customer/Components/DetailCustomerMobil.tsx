import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const DetailCustomerMobil: React.FC = () => {
  const [carData, setCarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { nopol } = useParams();

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(
          `http://trial.sigapdriver.com:8080/api/v1/mobil-detail/${nopol}`
        );
        const data = response.data;

        if (data.jadwal) {
          data.serviceHistories  = data.jadwal.map((item: any) => {
            try {
              const parsed = JSON.parse(item.ket_json);
              console.log("hahahah", parsed);
              
              return {
                tgl_jadwal: item.tgl_jadwal,
                type_service: item.type_service,
                lokasiService : item.lokasi_service,
                km: parsed.km || "",
                skor : parsed.skor || "",
                penyebab:parsed.penyebab || "",
                lokasi_service: parsed.lokasi || "",
                servis: parsed.service || "",
                keterangan: parsed.keterangan || "",
                status: item.status || ""
              };
            } catch (e) {
              console.error("Error parsing ket_json:", e);
              return {
                tgl_jadwal: item.tgl_jadwal,
                type_service: item.type_service,
                lokasiService : item.lokasi_service,
                km: "",
                lokasi_service: "",
                servis: "",
                keterangan: "",
                status: item.status || ""
              };
            }
          });
        }

        const photos = [data.photo1, data.photo2, data.photo3, data.photo4]
          .filter((photo: string | null) => photo && photo !== "");

        setCarData({ ...data, images: photos });
        console.log("Car data:", data);
      } catch (error: any) {
        if (error.response) {
          setError(`Error fetching car data: ${error.response.data.message}`);
        } else if (error.request) {
          setError("Error fetching car data: No response from server");
        } else {
          setError(`Error fetching car data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (nopol) {
      fetchCarData();
    } else {
      setError("Invalid nopol parameter");
      setLoading(false);
    }
  }, [nopol]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!carData) {
    return <div>No data available</div>;
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
          }

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

          .table-container {
            flex: 1 0 100%;
            margin-top: 20px;
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
            background-color: #f0f0f0;
            color: #333;
            font-weight: bold;
          }

          table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
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
        `}
      </style>

      <div className="container">
        <div className="car-info">
        {carData.images.length > 0 ? (
            <Carousel>
              {carData.images.map((image: string, index: number) => (
                <div key={index}>
                  <img src={image} alt={`Car Image ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          ) : (
            <div>No images available</div>
          )}
        </div>
        <div className="specs">
          <h2>Detail Kendaraan</h2>
          <div className="table-container">
            <table style={{ fontSize: 13.5 }} className="table table-sm">
              <tbody>
                <tr>
                  <td>
                    <strong>Tipe Kendaraan:</strong>
                  </td>
                  <td>{carData.tipe_kendaraan}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Pembuat:</strong>
                  </td>
                  <td>{carData.pembuat}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tahun:</strong>
                  </td>
                  <td>{carData.tahun}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Warna Kendaraan:</strong>
                  </td>
                  <td>{carData.warna_kendaraan}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nomor Polisi:</strong>
                  </td>
                  <td>{carData.nopol}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nomor Rangka:</strong>
                  </td>
                  <td>{carData.nomor_rangka}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nomor Mesin:</strong>
                  </td>
                  <td>{carData.nomor_mesin}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Pilihan (Aksesoris):</strong>
                  </td>
                  <td>{carData.pilihan_aksesoris}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Biaya Sewa:</strong>
                  </td>
                  <td>{carData.biaya_sewa}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Jangka Waktu Sewa:</strong>
                  </td>
                  <td>{carData.jangka_waktu_sewa}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Perusahaan:</strong>
                  </td>
                  <td>{carData.perusahaan}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container">
          <h2>Riwayat Uji Emisi</h2>
          <table>
            <tbody>
              <tr style={{ backgroundColor: "#009879", color: "white" }}>
                <td>
                  <strong>Tanggal</strong>
                </td>
                <td>
                  <strong>Lokasi</strong>
                </td>
                <td>
                  <strong>Skor</strong>
                </td>
                <td>
                  <strong>Status</strong>
                </td>
              </tr>
              {carData.serviceHistories && carData.serviceHistories.map((history: any, index: number) => (
                history.type_service === "uji_emisi" ? (
                  <tr key={index}>
                    <td>{history.tgl_jadwal}</td>
                    <td>{history.lokasiService}</td>
                    <td>{history.skor}</td>
                    <td>{history.status}</td>
                  </tr>
                ) : null
              ))}

            </tbody>
          </table>
        </div>
        <br />
        <div className="table-container">
          <h2>Riwayat Servis Kendaraan</h2>
          <table>
            <tbody>
              <tr style={{ backgroundColor: "#009879", color: "white" }}>
                <td>
                  <strong>KM</strong>
                </td>
                <td>
                  <strong>Lokasi</strong>
                </td>
                <td>
                  <strong>Servis</strong>
                </td>
                <td>
                  <strong>Keterangan</strong>
                </td>
                <td>
                  <strong>Status</strong>
                </td>
              </tr>
              {carData.serviceHistories && carData.serviceHistories.map((history: any, index: number) => (  
                history.type_service === "service_rutin" ? (
                <tr key={index}>
                  <td>{history.km}</td>
                  <td>{history.lokasiService}</td>
                  <td>{history.servis}</td>
                  <td>{history.keterangan}</td>
                  <td>{history.status}</td>
                </tr>
                 ) : null
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <div className="table-container">
          <h2>Riwayat Kecelakaan</h2>
          <table>
            <tbody>
              <tr style={{ backgroundColor: "#009879", color: "white" }}>
                <td>
                  <strong>Tanggal</strong>
                </td>
                <td>
                  <strong>Lokasi</strong>
                </td>
                <td>
                  <strong>Penyebab</strong>
                </td>
                <td>
                  <strong>Keterangan</strong>
                </td>
                <td>
                  <strong>Status</strong>
                </td>
              </tr>
              {carData.serviceHistories && carData.serviceHistories.map((history: any, index: number) => (
             history.type_service === "service_kecelakaan" ? (  
                <tr key={index}>
                  <td>{history.tgl_jadwal}</td>
                  <td>{history.lokasiService}</td>
                  <td>{history.penyebab}</td>
                  <td>{history.keterangan}</td>
                  <td>{history.status}</td>
                </tr>
             ):null
            ))}
            </tbody>
          </table>
        </div>
        <div className="table-container">
          <h2>Riwayat STNK</h2>
          <table>
            <tbody>
              <tr style={{ backgroundColor: "#009879", color: "white" }}>
                <td>
                  <strong>Tanggal</strong>
                </td>
                <td>
                  <strong>Lokasi</strong>
                </td>
                <td>
                  <strong>Keterangan</strong>
                </td>
                <td>
                  <strong>Status</strong>
                </td>
              </tr>
              {carData.serviceHistories && carData.serviceHistories.map((history: any, index: number) => (
                history.type_service === "ganti_stnk" ? (
                  <tr key={index}>
                    <td>{history.tgl_jadwal}</td>
                    <td>{history.lokasiService}</td>
                    <td>{history.keterangan}</td>
                    <td>{history.status}</td>
                  </tr>
                ) : null
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DetailCustomerMobil;