import React from 'react';

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
}

const tableData: TableData = {
  name: 'Otong Suryana',
  monday: ['06:00', '22:23'],
  tuesday: ['06:00', '22:23'],
  wednesday: ['06:06', '21:07'],
  thursday: ['06:06', '21:07'],
  friday: ['06:06', '06:06'],
  saturday: ['06:06', '06:06'],
  sunday: ['06:06', '06:06'],
  totalWorkHours: '43:45',
  totalRestHours: '05:15',
};

const ContentHeader = ({ title }: { title: string }) => {
  return (
    <section className="container my-4">
      <div className="text-center mb-4">
        <h1 className="font-weight-bold text-uppercase">{title}</h1>
        <p className="font-weight-bold text-uppercase">2024/06/03 - 2024/06/09</p>
      </div>
      <div className="mb-5 w-100 form-wrapper">
        <form action="" className="form-container">
          <div className="form-group d-flex align-items-center justify-content-center">
            <label htmlFor="startDate" className="form-label">Pilih Tanggal Awal</label>
            <input
              type="date"
              id="startDate"
              className="form-control ml-3 w-25"
              placeholder="Pilih Tanggal"
            />
            <button type="submit" className="btn btn-primary ml-3">Pilih Tanggal</button>
            <button type="submit" className="btn btn-success ml-3">Export Excel</button>
          </div>
        </form>
      </div>
      <div className="table-responsive">
        <style>
          {`
            
            .table-container {
              border-radius:  15px 15px 0 0;
              border-top: 1px solid #009879;
              border-top: none;
              overflow: hidden;
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
              background-color: white !important;
            }
            .table tbody tr:last-of-type {
               border-bottom: 2px solid #009879;
            }
          `}
        </style>
        <div className="table-container">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th rowSpan={2} className="align-middle text-center" style={{ width: '200px' }}>Nama</th>
                <th colSpan={14} className="text-center">Work Hours</th>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Total Hours</th>
              </tr>
              <tr>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Monday</th>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Tuesday</th>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Wednesday</th>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Thursday</th>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Friday</th>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Saturday</th>
                <th colSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Sunday</th>
                <th className="text-center" style={{ verticalAlign: "middle" }}>Work</th>
                <th className="text-center" style={{ verticalAlign: "middle" }}>Rest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="align-middle">{tableData.name}</td>
                {tableData.monday.map((time, index) => (
                  <td key={`monday-${index}`} className="text-center">{time}</td>
                ))}
                {tableData.tuesday.map((time, index) => (
                  <td key={`tuesday-${index}`} className="text-center">{time}</td>
                ))}
                {tableData.wednesday.map((time, index) => (
                  <td key={`wednesday-${index}`} className="text-center">{time}</td>
                ))}
                {tableData.thursday.map((time, index) => (
                  <td key={`thursday-${index}`} className="text-center">{time}</td>
                ))}
                {tableData.friday.map((time, index) => (
                  <td key={`friday-${index}`} className="text-center">{time}</td>
                ))}
                {tableData.saturday.map((time, index) => (
                  <td key={`saturday-${index}`} className="text-center">{time}</td>
                ))}
                {tableData.sunday.map((time, index) => (
                  <td key={`sunday-${index}`} className="text-center">{time}</td>
                ))}
                <td className="text-center">{tableData.totalWorkHours}</td>
                <td className="text-center">{tableData.totalRestHours}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ContentHeader;