import React, { useEffect, useState } from "react";
import "./Service.css";
import axios from "axios";

function Service() {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [idcompany, setidcompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.id_company) {
      const apiUrl =
        "https://script.google.com/macros/s/AKfycbz6CCimT0cdaqvNiX6rXDV9SkJ9R6tqZTG9HsAt19S_vn4A57SN8IXux2NHi57Sn_4o/exec";

      axios
        .get(apiUrl, {
          params: {
            id_company: userData.id_company,
          },
        })
        .then((response) => {
          let idhenkel = null;
          if (userData.id_company == "1112") {
            idhenkel = 351;
          } else if (userData.id_company == "1113") {
            idhenkel = 357;
          } else {
            idhenkel = userData.id_company;
          }
          const filteredData = response.data.filter(
            (event) => event.id == idhenkel
          );
          console.log("Response:", userData.id_company);
          setLoading(false);
          setFilteredEvents(filteredData);
          setidcompany(userData.id_compan);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, []);

  const formatDate = (dateStr) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const date = new Date(dateStr);
    date.setUTCDate(date.getUTCDate() + 1);

    const day = date.getUTCDate(); 
    const monthIndex = date.getUTCMonth(); 
    const year = date.getUTCFullYear();

    return `${day} ${months[monthIndex]} ${year}`;
  };

  // Updated renderSection to include iconClass
  const renderSection = (
    title,
    events,
    dateField,
    linkField,
    iconClass,
    color
  ) => (
    <div className="timeline-event">
      <div className="timeline-icon" style={{ backgroundColor: color }}>
        <i className={iconClass} />
      </div>
      <div className="timeline-details">
        <h4 className="timeline-title">{title}</h4>
        <div className="timeline-content">
          <div className="timeline-date">
            {events[0] && events[0][dateField]
              ? formatDate(events[0][dateField])
              : "Tanggal belum ditentukan"}
          </div>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.customer_name}</strong> (
                {event[dateField]
                  ? formatDate(event[dateField])
                  : "Di Jadwalkan"}
                ){" "}
                {event[linkField] && (
                  <a
                    href={event[linkField]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lihat Detail
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // Filter events by title
  const startKontrakEvents = filteredEvents.filter(
    (event) => event.tittle_start_kontrak === "Start Kontrak"
  );
  const pelaporanPKWTEvents = filteredEvents.filter(
    (event) => event.tittle_pelaporan_pkwt === "Pelaporan PKWT"
  );
  const mcuEvents = filteredEvents.filter(
    (event) => event.tittle_mcu === "MCU"
  );
  const trainingDriverEvents = filteredEvents.filter(
    (event) => event.tittle_training_driver === "Training Driver"
  );
  const finishKontrakEvents = filteredEvents.filter(
    (event) => event.tittle_finish_kontrak === "Finish Kontrak"
  );

  return (
    <div className="service-container">
      <div className="timeline">
        {!loading ? (
          <>
            {renderSection(
              "Start Kontrak",
              startKontrakEvents,
              "start_kontrak",
              "pelaporan_pkwt_agreement",
              "fa fa-file-contract",
              "blue"
            )}
            {renderSection(
              "Pelaporan PKWT",
              pelaporanPKWTEvents,
              "tanggal_pkwt",
              "link_softcopy_pelaporan_pkwt",
              "fa fa-file-alt",
              "orange"
            )}
            {renderSection(
              "MCU",
              mcuEvents,
              "tanggal_ba_mcu",
              "link_doc_ba_mcu",
              "fa fa-stethoscope",
              "purple"
            )}
            {renderSection(
              "Training Driver",
              trainingDriverEvents,
              "tanggal_ba_training",
              "link_doc_ba_training",
              "fa fa-car",
              "green"
            )}
            {renderSection(
              "Finish Kontrak",
              finishKontrakEvents,
              "finish_kontrak",
              "link_doc_ba_uang_kompensasi",
              "fa fa-calendar-check",
              "red"
            )}
          </>
        ) : (
          <div>Loading data...</div>
        )}
      </div>
    </div>
  );
}

export default Service;
