import React from 'react';

interface TableData {
  name: string[];
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
  name: ['Otong Suryana'],
  monday: ['06:00', '22:23'],
  tuesday: ['06:00', '22:23', ],
  wednesday: ['06:06', '21:07'],
  thursday: ['-', '-'],
  friday: ['-', '-'],
  saturday: ['-', '-'],
  sunday: ['-', '-'],
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
      <div className="mb-5 w-100">
        <form action="">
          <div className="form-group d-flex align-items-center justify-content-center">
            <label htmlFor="">Pilih Tanggal Awal</label>
            <input
              type="date"
              className="form-control ml-3 w-25"
              placeholder="Pilih Tanggal"
            />
            <button type="submit" className="btn btn-primary ml-3" >Plih Tanggal</button>
            <button type="submit" className="btn btn-success ml-3" >Export Excel</button>
          </div>
        </form>
      </div>
      <div className="table-responsive">
        <style>
        {`
          .table-bordered th,
          .table-bordered td {
            border: 1px solid #D1D8C5 !important;
          }
        `}
      </style>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th rowSpan={2} className="align-middle text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Nama</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Monday<br />06 May 2024</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Tuesday<br />07 May 2024</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Wednesday<br />08 May 2024</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Thursday<br />09 May 2024</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Friday<br />10 May 2024</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Saturday<br />11 May 2024</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Sunday<br />12 May 2024</th>
              <th colSpan={2} className="text-center" style={{  color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Total AWH</th>
            </tr>
            <tr>
              <th className="text-center" style={{  verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Masuk</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Keluar</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Masuk</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Keluar</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Masuk</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Keluar</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Masuk</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Keluar</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Masuk</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Keluar</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Masuk</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Keluar</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Masuk</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Keluar</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Total Jam Kerja</th>
              <th className="text-center" style={{   verticalAlign: "middle" , color: 'white', backgroundColor: 'rgb(4,170,109)' }}>Total Jam Istirahat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className=" align-middle">{tableData.name}</td>
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
    </section>
  );
};

export default ContentHeader;
