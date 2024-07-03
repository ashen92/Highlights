// import "./Footer.scss";
// import Logo from "../../assets/logo.png";
// import Aos from "aos";
// import "aos/dist/aos.css";
// import { useEffect } from "react";

// const Footer = () => {
//     useEffect(() => {
//         Aos.init({ duration: 1000 });
//     });

//     return (
//         <footer className="footer">
//             <div className="footer_container wrapper" data-aos="fade-up">
//                 <div className="footer_col">
//                     <img src={Logo} alt="logo" />
//                     <p>Master the art of productivity enhancement...</p>
//                 </div>

//                 <div className="footer_col">
//                     <h3>About</h3>
//                     <a href="#">About Us</a><br />
//                     <a href="#">Features</a>
//                 </div>

//                 <div className="footer_col">
//                     <h3>Product</h3>
//                     <a href="#">Get Started</a>
//                 </div>

//                 <div className="footer_col">
//                     <h3>Support</h3>
//                     <a href="#">Help Center</a>
//                 </div>

//                 <div className="footer_col">
//                     <h3>Resources</h3>
//                     <a href="#">Make Time App</a>
//                 </div>
//             </div>

//         </footer>
//     )
// };

// export default Footer;

import * as React from 'react';
import './Footer.scss';
import Logo from '../../assets/logo.png'; 
// const Logo = require('../../assets/logo.png');
// import Aos from 'aos';
// import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Footer: React.FC = () => {
  useEffect(() => {
    // Aos.init({ duration: 1000 });
  }, []);

  return (
    <footer className="footer">
      <div className="footer_container wrapper" >
        <div className="footer_col">
          <img src={Logo} alt="logo" />
          <p>Master the art of productivity enhancement...</p>
        </div>

        <div className="footer_col">
          <h3>About</h3>
          <a href="#">About Us</a><br />
          <a href="#">Features</a>
        </div>

        <div className="footer_col">
          <h3>Product</h3>
          <a href="#">Get Started</a>
        </div>

        <div className="footer_col">
          <h3>Support</h3>
          <a href="#">Help Center</a>
        </div>

        <div className="footer_col">
          <h3>Resources</h3>
          <a href="#">Make Time App</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
