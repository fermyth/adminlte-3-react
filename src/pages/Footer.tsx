const Footer = () => {
    return (
    <>
        <style>
        {`
        .version-info {
            font-size: 0.875rem;
            color: #6c757d;
            margin: 0;
            text-align: center;
        }
   
        .footer-container {
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #f8f9fa;
            padding: 10px 0;
        }
        `}
        </style>
        <footer className="footer-container">
            <div style={{ width: '75%', margin: '0 auto' }}>
                <p className="version-info">Version 1.3</p>
            </div>
        </footer>
    </>
    )
  }
   
  export default Footer;