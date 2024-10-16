import React, { useEffect, useState } from 'react';
import './Service.css';

function Service() {
  const [userIdCompany, setUserIdCompany] = useState(null);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.id_company) {
      setUserIdCompany(userData.id_company); 
    }
  }, []);

  const events = [
    {
      id_company: "351",
      title: 'Start Kontrak',
      date: '1 September 2024',
      icon: 'fa fa-file-contract',
      color: 'blue',
      description: [
        {
          id_company: "351",
          name: 'Henkel Indonesia, PT.',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EnV8dvi6_l5GhAGfivqdLegBj93DXRNYIGDW_zyJ5kZi_Q?e=APeSWb',
          date: '1 September 2024'
        },
        // {
        //   id_company: "351",
        //   name: 'Henkel Footwear Indonesia, PT',
        //   link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/El4IRZHCNURCvZpaC6OUMiYB6Zg1ECmN71FvUJRSW9Cnrw?e=DtEF9d',
        //   date: '1 September 2024'
        // }
      ]
    },
    {
      id_company: "351",
      title: 'Pelaporan PKWT',
      date: '',
      icon: 'fa fa-file-alt',
      color: 'orange',
      description: [
        {
          id_company: "351",
          name: 'Henkel Indonesia, PT.',
          date: 'Di Jadwalkan'
        },
        // {
        //   id_company: "351",
        //   name: 'Henkel Footwear Indonesia, PT',
        //   date: 'Di Jadwalkan' 
        // }
      ]
    },
    {
      id_company: "351",
      title: 'MCU',
      date: '',
      icon: 'fa fa-stethoscope',
      color: 'orange',
      description: [
        {
          id_company: "351",
          name: 'Henkel Indonesia, PT.',
          date: 'Di Jadwalkan'
        },
        // {
        //   id_company: "351",
        //   name: 'Henkel Footwear Indonesia, PT',
        //   date: 'Di Jadwalkan'
        // }
      ]
    },
    {
      id_company: "351",
      title: 'Training Driver',
      icon: 'fa fa-car',
      color: 'green',
      description: [
        {
          id_company: "351",
          name: 'Henkel Indonesia, PT.',
          date: 'Di Jadwalkan'
        },
        // {
        //   id_company: "351",
        //   name: 'Henkel Footwear Indonesia, PT',
        //   date: 'Di Jadwalkan'
        // }
      ]
    },
    {
      id_company: "351",
      title: 'Finish Kontrak',
      date: '31 Agustus 2028',
      icon: 'fa fa-calendar-check',
      color: 'purple',
      description: [
        {
          id_company: "351",
          name: 'Henkel Indonesia, PT.',
          date: 'Di Jadwalkan'
        },
        // {
        //   id_company: "351",
        //   name: 'Henkel Footwear Indonesia, PT',
        //   date: 'Di Jadwalkan'
        // }
      ]
    },


    // Footwer 
    {
      id_company: "357",
      title: 'Start Kontrak',
      date: '1 September 2024',
      icon: 'fa fa-file-contract',
      color: 'blue',
      description: [
        // {
        //   id_company: "357",
        //   name: 'Henkel Indonesia, PT.',
        //   link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EnV8dvi6_l5GhAGfivqdLegBj93DXRNYIGDW_zyJ5kZi_Q?e=APeSWb',
        //   date: '1 September 2024'
        // },
        {
          id_company: "357",
          name: 'Henkel Footwear Indonesia, PT',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/El4IRZHCNURCvZpaC6OUMiYB6Zg1ECmN71FvUJRSW9Cnrw?e=DtEF9d',
          date: '1 September 2024'
        }
      ]
    },
    {
      id_company: "357",
      title: 'Pelaporan PKWT',
      date: '',
      icon: 'fa fa-file-alt',
      color: 'orange',
      description: [
        // {
        //   id_company: "357",
        //   name: 'Henkel Indonesia, PT.',
        //   date: 'Di Jadwalkan'
        // },
        {
          id_company: "357",
          name: 'Henkel Footwear Indonesia, PT',
          date: 'Di Jadwalkan' 
        }
      ]
    },
    {
      id_company: "357",
      title: 'MCU',
      date: '',
      icon: 'fa fa-stethoscope',
      color: 'orange',
      description: [
        // {
        //   id_company: "357",
        //   name: 'Henkel Indonesia, PT.',
        //   date: 'Di Jadwalkan'
        // },
        {
          id_company: "357",
          name: 'Henkel Footwear Indonesia, PT',
          date: 'Di Jadwalkan'
        }
      ]
    },
    {
      id_company: "357",
      title: 'Training Driver',
      icon: 'fa fa-car',
      color: 'green',
      description: [
        // {
        //   id_company: "357",
        //   name: 'Henkel Indonesia, PT.',
        //   date: 'Di Jadwalkan'
        // },
        {
          id_company: "357",
          name: 'Henkel Footwear Indonesia, PT',
          date: 'Di Jadwalkan'
        }
      ]
    },
    {
      id_company: "357",
      title: 'Finish Kontrak',
      date: '31 Agustus 2028',
      icon: 'fa fa-calendar-check',
      color: 'purple',
      description: [
        // {
        //   id_company: "357",
        //   name: 'Henkel Indonesia, PT.',
        //   date: 'Di Jadwalkan'
        // },
        {
          id_company: "357",
          name: 'Henkel Footwear Indonesia, PT',
          date: 'Di Jadwalkan'
        }
      ]
    },

//HTI//

    {
      id_company: "289",
      title: 'Start Kontrak',
      date: '16 Desember 2023',
      icon: 'fa fa-file-contract',
      color: 'blue',
      description: [
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Bekasi)',
          link: 'https://permatasolusindo-my.sharepoint.com/:b:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EdHLVzPxI2FGu1hWe8vThhsBW-7-GeMkelFBplbwkNjQgQ?e=7iIeIP',
          date: '16 Desember 2023'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Karawang)',
          link: 'https://permatasolusindo-my.sharepoint.com/:b:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EaLtKaJrjW1MjZaUYa7ze0UBgoZoNzmgbFrsDtqJ5mmmlg?e=ZQpBcW',
          date: '16 Desember 2023'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Jakarta)',
          link: 'https://permatasolusindo-my.sharepoint.com/:b:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/ERbe_NZCuXhFu7ZxiG2XJd0B43YqYomSdGNbbNiTr30QKg?e=cvEEmY',
          date: '16 Desember 2023'
        }
      ]
    },
    {
      id_company: "289",
      title: 'Pelaporan PKWT',
      date: '',
      icon: 'fa fa-file-alt',
      color: 'orange',
      description: [
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Bekasi)',
          date: 'Di Jadwalkan'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Karawang)',
          date: 'Di Jadwalkan' 
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Jakarta)',
          link: 'https://permatasolusindo-my.sharepoint.com/:b:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EYWYGL5wC6lKh3_-vcrwFbcBb_QEkX6fRumhdciRJHtvlQ?e=XSJnYg',
          date: '22 Maret 2024'
        }
      ]
    },
    {
      id_company: "289",
      title: 'MCU',
      date: 'Sudah Di lakukan',
      icon: 'fa fa-stethoscope',
      color: 'orange',
      description: [
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Bekasi)',
          link: 'https://permatasolusindo-my.sharepoint.com/:b:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/ES1oW3cYkrxLmyfSzdSN-zwBryeqb94Hw33AkiBqzMBl_g?e=awcaaU',
          date: '28 Maret 2024'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Karawang)',
          link: 'https://permatasolusindo-my.sharepoint.com/:b:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/ES1oW3cYkrxLmyfSzdSN-zwBryeqb94Hw33AkiBqzMBl_g?e=awcaaU',
          date: '6 Maret 2024'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Jakarta)',
          link: 'https://permatasolusindo-my.sharepoint.com/:b:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/ES1oW3cYkrxLmyfSzdSN-zwBryeqb94Hw33AkiBqzMBl_g?e=awcaaU',
          date: '6 Maret 2024'
        },
      ]
    },
    {
      id_company: "289",
      title: 'Training Driver',
      date: '6 Juli 2023',
      icon: 'fa fa-car',
      color: 'green',
      description: [
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Bekasi)',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EvE5RuHL0mVLgjFYwRWRLucBK1Xl2bBpwtszDRyowDqINQ?e=DD1Nzw',
          date: '6 Juli 2023'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Karawang)',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EvE5RuHL0mVLgjFYwRWRLucBK1Xl2bBpwtszDRyowDqINQ?e=DD1Nzw',
          date: '6 Juli 2023'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Jakarta)',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EvE5RuHL0mVLgjFYwRWRLucBK1Xl2bBpwtszDRyowDqINQ?e=DD1Nzw',
          date: '6 Juli 2023'
        },
      ]
    },
    {
      id_company: "289",
      title: 'Finish Kontrak',
      date: '15 Desember 2024',
      icon: 'fa fa-calendar-check',
      color: 'purple',
      description: [
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Bekasi)',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EjvNvWRtys1PpbD30IZhLpQB1ebKWg6tAnv0rqMgKcncMQ?e=CgCrNO',
          date: '15 Desember 2024'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Karawang)',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EjvNvWRtys1PpbD30IZhLpQB1ebKWg6tAnv0rqMgKcncMQ?e=CgCrNO',
          date: '15 Desember 2024'
        },
        {
          id_company: "289",
          name: 'Honda Trading Indonesiai, PT (Jakarta)',
          link: 'https://permatasolusindo-my.sharepoint.com/:f:/g/personal/ivan_prihartono_permatasolusindo_onmicrosoft_com/EjvNvWRtys1PpbD30IZhLpQB1ebKWg6tAnv0rqMgKcncMQ?e=CgCrNO',
          date: '15 Desember 2024'
        },
      ]
    },
  ];


  // Filter events berdasarkan id_company
  const filteredEvents = events.filter(event =>
    event.id_company === "351" && (userIdCompany === "351" || userIdCompany === "1112") ||
    event.id_company === "357" && (userIdCompany === "357" || userIdCompany === "1113") ||
    event.id_company === "289" && userIdCompany === "289"

  );
  console.log("hahahaha", filteredEvents);

  return (
    <div className="service-container">
      <div className="timeline">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className="timeline-event">
              <div className="timeline-icon" style={{ backgroundColor: event.color }}>
                <i className={event.icon} />
              </div>
              <div className="timeline-details">
                <h4 className="timeline-title">{event.title}</h4>
                <div className="timeline-content">
                  <div className="timeline-date">{event.date || 'Tanggal belum ditentukan'}</div>
                  <ul>
                    {event.description.map((desc, idx) => (
                      <li key={idx}>
                        <strong>{desc.name}</strong> ({desc.date}){' '}
                        {desc.link && (
                          <a href={desc.link} target="_blank" rel="noopener noreferrer">
                            Lihat Detail
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Tidak ada event yang tersedia.</div>
        )}
      </div>
    </div>
  );
}

export default Service;
