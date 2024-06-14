import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface TableData {
  name: string;
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
  totalWorkHours: string;
  totalRestHours: string;
  colorCode: string;
}

const ContentHeader = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (start: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backend.sigapdriver.com/api/greatdayinout/${start}/33`);
      const data = response.data.data;
      const drivers = data.drivers;
      const jamMasuk = data.jam_masuk;
      const jamKeluar = data.jam_keluar;
      const awh = data.awh;
      const colorCodes = data.color_code;

      const formattedData = drivers.filter(driver => driver).map(driver => ({
        name: driver,
        monday: [jamMasuk[driver][0], jamKeluar[driver][0]],
        tuesday: [jamMasuk[driver][1], jamKeluar[driver][1]],
        wednesday: [jamMasuk[driver][2], jamKeluar[driver][2]],
        thursday: [jamMasuk[driver][3], jamKeluar[driver][3]],
        friday: [jamMasuk[driver][4], jamKeluar[driver][4]],
        saturday: [jamMasuk[driver][5], jamKeluar[driver][5]],
        sunday: [jamMasuk[driver][6], jamKeluar[driver][6]],
        totalWorkHours: awh[driver].split(" || ")[0],
        totalRestHours: awh[driver].split(" || ")[1],
        colorCode: colorCodes[driver]
      }));

      setTableData(formattedData);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const calculateDates = (start: string) => {
    const startDate = new Date(start);
    const selectedDayIndex = startDate.getDay(); 
    const daysToAdd = selectedDayIndex === 0 ? -6 : 1 - selectedDayIndex;
    startDate.setDate(startDate.getDate() + daysToAdd);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newDates = daysOfWeek.map((day, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return `${day} ${date.toISOString().split('T')[0]}`;
    });
    setDates(newDates);
  };
  

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (startDate) {
      calculateDates(startDate);
      fetchData(startDate);
    }
  };

  return (
    <section className="container my-4">
      <div className="text-center mb-4">
        <h1 className="font-weight-bold text-uppercase">Laporan Jam Kerja</h1>
        <p className="font-weight-bold text-uppercase">{startDate ? `${dates[0]} - ${dates[6]}` : 'Pilih Tanggal'}</p>

      </div>
      <div className="mb-5 w-100 form-wrapper">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group d-flex align-items-center justify-content-center">
            <label htmlFor="startDate" className="form-label">Pilih Tanggal Awal</label>
            <input
              type="date"
              id="startDate"
              className="form-control ml-3 w-25"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Pilih Tanggal"
            />
            <button type="submit" className="btn btn-dark ml-3">Pilih Tanggal</button>
            <button type="button" className="btn btn-success custom-btn ml-3" onClick={() => alert('Export to Excel feature is not implemented yet.')}>Export Excel</button>
          </div>
        </form>
      </div>
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <style>
          {`
             .btn-success.custom-btn {
        background-color: #009879;
        border-color: #009879;
    }

    .btn-success.custom-btn:hover {
        background-color: #007f66; /* Warna yang sedikit lebih gelap untuk efek hover */
        border-color: #007f66;
    }
            .table-bordered th,
            .table-bordered td {
              border: 1px solid #ccc !important;
            }
            .table thead th {
              background-color: #009879;
              color: white;
              text-align: center;
              vertical-align: middle;
            }
            .table tbody td {
              text-align: center;
              vertical-align: middle;
            }
            .table tbody tr:last-of-type {
              border-bottom: 2px solid #009879;
            }
            .sticky-column  {
              border-radius: 15px 0 0 0;
              overflow: hidden;
            }
            .sticky  {
              border-radius: 0 15px  0 0;
              overflow: hidden;
            }
            .table tbody tr:last-of-type {
              border-bottom: 2px solid #009879;
            }
            .sticky-column {
              position: sticky;
              left: 0;
              background-color: #CCE2CB;
              z-index: 3;
            }
          `}
        </style>
        <div className="table-container">
          {loading ? (
            <div className="text-center my-4">Data sedang diproses...</div>
          ) : (
            <table className="table table-bordered" style={{ minWidth: '150%' }}>
              <thead>
                <tr>
                  <th rowSpan={2} className="align-middle text-center sticky-column" style={{ width: '200px' }}>Nama</th>
                  <th colSpan={14} className="text-center">Work Hours</th>
                  <th colSpan={2} className="text-center sticky">Total Hours</th>
                </tr>
                <tr>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <React.Fragment key={index}>
                      <th colSpan={2} className="text-center">{day}  {dates[index]}</th>
                    </React.Fragment>
                  ))}
                  <th className="text-center">Work</th>
                  <th className="text-center">Rest</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((driver, index) => (
                    <tr key={index}>
                      <td className="align-middle                       sticky-column ">{driver.name}</td>
                      {driver.monday.map((time, idx) => (
                        <td key={`monday-${idx}`} className="text-center">{time}</td>
                      ))}
                      {driver.tuesday.map((time, idx) => (
                        <td key={`tuesday-${idx}`} className="text-center">{time}</td>
                      ))}
                      {driver.wednesday.map((time, idx) => (
                        <td key={`wednesday-${idx}`} className="text-center">{time}</td>
                      ))}
                      {driver.thursday.map((time, idx) => (
                        <td key={`thursday-${idx}`} className="text-center">{time}</td>
                      ))}
                      {driver.friday.map((time, idx) => (
                        <td key={`friday-${idx}`} className="text-center">{time}</td>
                      ))}
                      {driver.saturday.map((time, idx) => (
                        <td key={`saturday-${idx}`} className="text-center">{time}</td>
                      ))}
                      {driver.sunday.map((time, idx) => (
                        <td key={`sunday-${idx}`} className="text-center">{time}</td>
                      ))}
                      <td className="text-center" style={{ backgroundColor: driver.colorCode }}>{driver.totalWorkHours}</td>
                      <td className="text-center" style={{ backgroundColor: driver.colorCode }}>{driver.totalRestHours}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="align-middle sticky-column text-center" colSpan={17}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentHeader;

