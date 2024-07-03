// import "./Hero.scss"
// import Home1 from "../../assets/home1.jpg"
// import Img2 from "../../assets/home2.jpg"
// import Img3 from "../../assets/home3.jpg"
// import Img4 from "../../assets/home4.jpg"
// import Aos from "aos";
// import "aos/dist/aos.css";
// import { useEffect } from "react";

// const Hero = () => {

//     useEffect(() => {
//         Aos.init({duration: 1000});
//     });

//     return (
//         <section>
//             <div className="hero_container wrapper">
//                 <div className="hero_left" data-aos="zoom-in-up">
//                     <h1>Master The Art of Productivity Enhancement...</h1>
//                     <a href="#" className="hero_btn">Sign Up Now</a>
//                 </div>
//                 <div className="hero_right" data-aos="fade-left">
//                     <img src={Home1} alt="image1" />
//                 </div>
//             </div>

//             <div className="home2_container wrapper">
//                 <div className="home2_left" data-aos="fade-right">
//                     <img src={Img2} alt="image1" />    
//                 </div>

//                 <div className="home2_right" data-aos="zoom-in-up">
//                     <h3>Keep every task  scheduled in your life.</h3>
//                     <p>Whether there are tasks in your to-do lists (Eg:- Google Tasks) or novel upcoming events, HIGHLIGHTS is there to organize and manage them all.</p>
//                 </div>
//             </div>

//             <div className="home3_container wrapper">
//                 <div className="home3_left" data-aos="zoom-in-up">
//                     <h3>Get reminded anytime.</h3>
//                     <p>We remind you the upcoming tasks anytime on your preference. (Eg:- On time, 5 minutes before, 15 minutes before, etc...)</p>
//                 </div>

//                 <div className="home3_right" data-aos="fade-left">
//                     <img src={Img3} alt="image1" /> 
//                 </div>
//             </div>

//             <div className="home4_container wrapper">
//                 <div className="home4_left" data-aos="fade-right">
//                     <img src={Img4} alt="image1" />    
//                 </div>

//                 <div className="home4_right" data-aos="zoom-in-up">
//                     <h3>Get everything on your calendar.</h3>
//                     <p>We integrate with Google Calendar and make every highlight you scheduled, a calendar event for your convenience.</p>
//                 </div>
//             </div>
//         </section>

//     );
// };

// export default Hero;

import * as React from 'react';
import './Hero.scss';
import Home1 from '../../assets/home1.jpg';
import Img2 from '../../assets/home2.jpg';
import Img3 from '../../assets/home3.jpg';
import Img4 from '../../assets/home4.jpg';
// const Home1 = require('../../assets/home1.jpg');
// const Img2 = require('../../assets/home2.jpg');
// const Img3 = require('../../assets/home3.jpg');
// const Img4 = require('../../assets/home4.jpg');
// import Aos from 'aos';
// import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Hero: React.FC = () => {
  useEffect(() => {
    // Aos.init({ duration: 1000 });
  }, []);

  return (
    <section>
      <div className="hero_container wrapper">
        <div className="hero_left" >
          <h1>Master The Art of Productivity Enhancement...</h1>
          <a href="#" className="hero_btn">Sign Up Now</a>
        </div>
        <div className="hero_right" >
          <img src={Home1} alt="image1" />
        </div>
      </div>

      <div className="home2_container wrapper">
        <div className="home2_left">
          <img src={Img2} alt="image2" />
        </div>

        <div className="home2_right">
          <h3>Keep every task scheduled in your life.</h3>
          <p>Whether there are tasks in your to-do lists (Eg:- Google Tasks) or novel upcoming events, HIGHLIGHTS is there to organize and manage them all.</p>
        </div>
      </div>

      <div className="home3_container wrapper">
        <div className="home3_left">
          <h3>Get reminded anytime.</h3>
          <p>We remind you of upcoming tasks at your preferred time (Eg:- On time, 5 minutes before, 15 minutes before, etc...)</p>
        </div>

        <div className="home3_right">
          <img src={Img3} alt="image3" />
        </div>
      </div>

      <div className="home4_container wrapper">
        <div className="home4_left" >
          <img src={Img4} alt="image4" />
        </div>

        <div className="home4_right">
          <h3>Get everything on your calendar.</h3>
          <p>We integrate with Google Calendar and turn every highlight you schedule into a calendar event for your convenience.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
