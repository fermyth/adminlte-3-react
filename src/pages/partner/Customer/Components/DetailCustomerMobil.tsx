import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { UrlServer } from "@app/libs/Api";

const DetailCustomerMobil: React.FC = () => {
  const [carData, setCarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { nopol } = useParams();
  const url = UrlServer()

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(
          `${url}mobil-detail/${nopol}`
        );
        const data = response.data;
        console.log("cekdatamobil", data);

        if (data.jadwal) {
          data.serviceHistories = data.jadwal.map((item: any) => {
            try {
              const parsed = JSON.parse(item.ket_json);
              console.log("cek", parsed);

              return {
                tgl_jadwal: item.tgl_jadwal,
                type_service: item.type_service,
                lokasiService: item.lokasi_service,
                statusKerja : item.status_uji_emisi,
                km: parsed.km || "",
                skor: parsed.skor || "",
                penyebab: parsed.penyebab || "",
                lokasi_service: parsed.lokasi || "",
                servic: parsed.servic || "",
                keterangan: parsed.keterangan || "",
                status: item.status || "",
              };
            } catch (e) {
              console.error("Error parsing ket_json:", e);
              return {
                tgl_jadwal: item.tgl_jadwal,
                type_service: item.type_service,
                lokasiService: item.lokasi_service,
                km: "",
                lokasi_service: "",
                servic: "",
                keterangan: "",
                status: item.status || "",
              };
            }
          });
        }

        const photos = [
          data.photo1,
          data.photo2,
          data.photo3,
          data.photo4,
        ].filter((photo: string | null) => photo && photo !== "");

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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
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
            max-width: 1320px;
            margin: 0px auto;
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
            padding: 0 0px;
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
      <br></br>
      <div className="container mb-5">
        <div className="car-info">
          {carData.images.length > 0 ? (
            <Carousel>
              {carData.images.map((image: string, index: number) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Car Image ${index + 1}`}
                    style={{ width: "50%", maxWidth: "73%" }}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div>No images available</div>
          )}
        </div>
        <div className="specs">
          <h2>Vehicle Details</h2>
          <div className="table-container">
            <table style={{ fontSize: 13.5 }} className="table table-sm">
              <tbody>
                <tr>
                  <td>
                    <strong>Contract Number:</strong>
                  </td>
                  <td>{carData.contract_number}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Vehicle Type:</strong>
                  </td>
                  <td>{carData.tipe_kendaraan}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Vehicle Vendor:</strong>
                  </td>
                  <td>{carData.vendor}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Year:</strong>
                  </td>
                  <td>{carData.tahun}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Vehicle Color:</strong>
                  </td>
                  <td>{carData.warna_kendaraan}</td>
                </tr>
                <tr>
                  <td>
                    <strong>License Plate:</strong>
                  </td>
                  <td>{carData.nopol}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Rental Fee:</strong>
                  </td>
                  <td>
                    {carData.biaya_sewa
                      ? new Intl.NumberFormat("id-ID", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(Number(carData.biaya_sewa))
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Rental Period:</strong>
                  </td>
                  <td>{carData.jangka_waktu_sewa}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Customer Name:</strong>
                  </td>
                  <td>{carData.perusahaan}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {carData.serviceHistories &&
          carData.serviceHistories.some(
            (history: any) => history.type_service === "uji_emisi"
          ) && (
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
                      <strong>status pekerjaan</strong>
                    </td>
                    <td>
                      <strong>Status</strong>
                    </td>
                  </tr>
                  {carData.serviceHistories
                    .filter(
                      (history: any) => history.type_service === "uji_emisi"
                    )
                    .map((history: any, index: number) => (
                      <tr key={index}>
                        <td>{history.tgl_jadwal}</td>
                        <td>{history.lokasiService}</td>
                        <td>{history.skor}</td>
                        <td>{history.statusKerja}</td>
                        <td>{history.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        <br />
        {carData.serviceHistories && carData.serviceHistories.some((history: any) => history.type_service === "service_rutin") && (
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
              {carData.serviceHistories
                    .filter(
                      (history: any) =>
                        history.type_service === "service_rutin"
                    )
                    .map((history: any, index: number) => (
                    <tr key={index}>
                      <td>{history.km}</td>
                      <td>{history.lokasiService}</td>
                      <td>{history.servic}</td>
                      <td>{history.keterangan}</td>
                      <td>{history.status}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
        )}
        <br />
        {carData.serviceHistories && carData.serviceHistories.some((history: any) => history.type_service === "service_kecelakaan") && (
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
              {carData.serviceHistories
                    .filter(
                      (history: any) =>
                        history.type_service === "service_kecelakaan"
                    )
                    .map((history: any, index: number) => (
                    <tr key={index}>
                      <td>{history.tgl_jadwal}</td>
                      <td>{history.lokasiService}</td>
                      <td>{history.penyebab}</td>
                      <td>{history.keterangan}</td>
                      <td>{history.status}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
        )}
         {carData.serviceHistories && carData.serviceHistories.some((history: any) => history.type_service === "ganti_stnk") && (
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
              {carData.serviceHistories
                    .filter(
                      (history: any) =>
                        history.type_service === "ganti_stnk"
                    )
                    .map((history: any, index: number) => (
                    <tr key={index}>
                      <td>{history.tgl_jadwal}</td>
                      <td>{history.lokasiService}</td>
                      <td>{history.keterangan}</td>
                      <td>{history.status}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
         )}
      </div>
    </>
  );
};

export default DetailCustomerMobil;
