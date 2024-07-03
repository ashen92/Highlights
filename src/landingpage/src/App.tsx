// import Navbar from "./components/navbar/Navbar";
// import Hero from "./components/hero/Hero";
// import Footer from "./components/footer/Footer";

// function App() {

//   return (
//     <>
//       <Navbar/>
//       <Hero/>
//       <Footer/>
//     </>
//   )
// }

// export default App

import * as React from 'react';
import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero';
import Footer from './components/footer/Footer';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}

export default App;