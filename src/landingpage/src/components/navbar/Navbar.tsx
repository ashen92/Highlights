// import "./Navbar.scss";
// import Logo from "../../assets/logo.png";
// import { IoMenu } from "react-icons/io5";
// import { IoMdClose } from "react-icons/io";
// import { useState } from "react";

// const Navbar = () => {
// const [showNav, setshowNav] = useState(false)
//     return(
//         <header className="navbar">
//             <nav className="navbar_container wrapper">
//                 <a href="#" className="navbar_logo" onClick={() => setshowNav(false)}> 
//                     <img src={Logo} alt="logo" />
//                 </a>

//                 <ul className={`${showNav ? "show" : ""}`}>
//                     <li onClick={() => setshowNav(false)}>
//                         <a href="#">Home</a>
//                     </li>
//                     <li onClick={() => setshowNav(false)}>
//                         <a href="#">Features</a>
//                     </li>
//                     <li onClick={() => setshowNav(false)}>
//                         <a href="#">Help</a>
//                     </li>
//                 </ul>

//                 <div className="navbar_btns">
//                     <a href="#" className="btn">Login</a>
//                     <a href="#" className="btn">Sign Up</a>
//                 </div>

//                 <div className="navbar_menu" onClick={() => setshowNav(!showNav)}>
//                     {showNav ? <IoMdClose/> : <IoMenu/>}
//                 </div>
//             </nav>
//         </header>
//     )
// }

// export default Navbar

import * as React from 'react';
import './Navbar.scss';
import Logo from '../../assets/logo.png'; 
// const Logo = require('../../assets/logo.png');
import { IoMenu } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [showNav, setShowNav] = useState(false);

  return (
    <header className="navbar">
      <nav className="navbar_container wrapper">
        <a href="#" className="navbar_logo" onClick={() => setShowNav(false)}> 
          <img src={Logo} alt="logo" />
        </a>

        <ul className={`${showNav ? "show" : ""}`}>
          <li onClick={() => setShowNav(false)}>
            <a href="#">Home</a>
          </li>
          <li onClick={() => setShowNav(false)}>
            <a href="#">Features</a>
          </li>
          <li onClick={() => setShowNav(false)}>
            <a href="#">Help</a>
          </li>
        </ul>

        <div className="navbar_btns">
          <a href="#" className="btn">Login</a>
          <a href="#" className="btn">Sign Up</a>
        </div>

        <div className="navbar_menu" onClick={() => setShowNav(!showNav)}>
          {showNav ? <IoMdClose /> : <IoMenu />}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
