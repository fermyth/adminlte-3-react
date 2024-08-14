import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';



const Vehicle = () => {
  // Data sampel untuk tabel
  const vehicles = [
    { id: 1, policeNumber: 'B 1234 XYZ', unitType: 'SUV', contractEnd: '2024-12-31', rentPrice: '$500', total: '$6000' },
    { id: 2, policeNumber: 'B 5678 ABC', unitType: 'Sedan', contractEnd: '2025-06-15', rentPrice: '$400', total: '$4800' },
    { id: 3, policeNumber: 'B 9101 DEF', unitType: 'Truck', contractEnd: '2024-08-01', rentPrice: '$700', total: '$8400' },
    { id: 4, policeNumber: 'B 2468 GHI', unitType: 'MPV', contractEnd: '2025-03-20', rentPrice: '$450', total: '$5400' },
    { id: 5, policeNumber: 'B 1357 JKL', unitType: 'Hatchback', contractEnd: '2024-10-10', rentPrice: '$350', total: '$4200' },
    { id: 6, policeNumber: 'B 3690 MNO', unitType: 'SUV', contractEnd: '2025-01-05', rentPrice: '$550', total: '$6600' },
    { id: 7, policeNumber: 'B 2580 PQR', unitType: 'Sedan', contractEnd: '2024-11-30', rentPrice: '$420', total: '$5040' },
    { id: 8, policeNumber: 'B 1470 STU', unitType: 'Truck', contractEnd: '2025-04-15', rentPrice: '$750', total: '$9000' },
    { id: 9, policeNumber: 'B 3692 VWX', unitType: 'MPV', contractEnd: '2024-09-25', rentPrice: '$480', total: '$5760' },
    { id: 10, policeNumber: 'B 1593 YZA', unitType: 'Hatchback', contractEnd: '2025-02-28', rentPrice: '$380', total: '$4560' },
  ];

  const columns = [
    {
      dataField: 'id',
      text: 'No',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'policeNumber',
      text: 'Nomor Polisi',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'unitType',
      text: 'Tipe Unit',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'contractEnd',
      text: 'Akhir Kontrak',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'rentPrice',
      text: 'Harga Sewa',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'total',
      text: 'Total',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
  ];

  const paginationOptions = {
    sizePerPage: 5,
    showTotal: true,
    hideSizePerPage: false,
    sizePerPageList: [5, 10],
  };

  const { SearchBar } = Search;

  return (
    <div className="container mt-5" style={{marginBottom:'10%'}}>
      <h1 className="text-center mb-4 text-dark font-weight-bold">Vehicle</h1>

      <ToolkitProvider
        keyField="id"
        data={vehicles}
        columns={columns}
        search
      >
        {
          props => (
            <div>
              <div className="mb-3">
                <SearchBar {...props.searchProps} placeholder="Search" className="form-control" />
              </div>
              <BootstrapTable
                {...props.baseProps}
                bootstrap4
                striped
                hover
                bordered={false}
                pagination={paginationFactory(paginationOptions)}
                classes="table-bordered w-100"
              />
            </div>
          )
        }
      </ToolkitProvider>

      <style>
        {`
          .container {
            max-width: 1300px;
          }
          .table-bordered {
            border-radius: 15px 15px 0 0;
            border-top: 1px solid #009879;
            overflow: hidden;
            width: 100%;
          }
          .dropdown-item:hover {
            background-color: #17a2b8;
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default Vehicle;
