import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useParams } from "react-router-dom";
import L from "leaflet";

const Maps: React.FC = () => {
  const { lat, long } = useParams<{ lat: string; long: string }>();
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (lat && long) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(long);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        setSelectedLocation([latitude, longitude]);
      } else {
        console.error("Koordinat tidak valid");
      }
    }
  }, [lat, long]);

  return (
    <section className="containers" style={{ padding: 20 }}>
      <div style={{ height: "1000px", width: "100%" }}>
        {selectedLocation[0] !== 0 && selectedLocation[1] !== 0 && (
          <MapContainer
            center={selectedLocation}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker 
              position={selectedLocation}
              icon={L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>Lokasi pengguna</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Maps;
