import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { useLocation } from 'react-router-dom';

const Vehicle = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [idCompany, setIdCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get id company
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const getstorage = JSON.parse(userData);
          setIdCompany(getstorage.id_company);
        } else {
          setIdCompany(null);
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (idCompany) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // const response = await fetch(`http://localhost:5182/api/v1/mobil-perusahaan/${idCompany}`);
          const response = await fetch(`https://api_partner_staging.sigapdriver.com/api/v1/mobil-perusahaan/${idCompany}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("caca", data);
          
          setCompanies(data);
        } catch (error: any) {
          setError("Failed to fetch data: " + error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [idCompany, location.key]);

  function formatCurrency(value : any) {
    const numberValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  
    if (isNaN(numberValue)) {
      console.error('Value is not a valid number:', value);
      return 'Rp -'; 
    }
    return 'Rp ' + numberValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  

  const columns = [
    {
      dataField: 'id',
      text: 'No',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'nopol',
      text: 'Nomor Polisi',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'tb_perusahaan.nama_perusahaan',
      text: 'Perusahaan',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'tipe_kendaraan',
      text: 'Tipe Unit',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'jangka_waktu_sewa',
      text: 'Mulai Kontrak',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'contract_end',
      text: 'Akhir Kontrak',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true
    },
    {
      dataField: 'biaya_sewa',
      text: 'Harga Sewa',
      headerStyle: { backgroundColor: '#009879', color: 'white' },
      sort: true,
      formatter: (cell: any) => formatCurrency(cell),
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
    <div className="container mt-5" style={{ marginBottom: '10%' }}>
      <h1 className="text-center mb-4 text-dark font-weight-bold">Vehicle</h1>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <ToolkitProvider
          keyField="id"
          data={companies}
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
      )}

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
