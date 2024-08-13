const Footer = () => {
    return (
    <>
        <style>
        {`
        .version-info {
            font-size: 0.875rem;
            color: #6c757d;
            margin-top: 1rem;
            text-align: center;
        }
   
        .footer-container {
            width: 75%;
            margin: 0 auto;
        }
        `}
        </style>
        <div className="footer-container">
            <p className="version-info">Version 1.2</p>
        </div>
    </>
    )
  }
   
  export default Footer;