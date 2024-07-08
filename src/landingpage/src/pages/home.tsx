import Navbar from "../components/navbar/Navbar";
import Hero from "../components/home/Home";
import Footer from "../components/footer/Footer";
import "../app/globals.scss";


export default function home () {
    return (
        <>
            <Navbar/>
            <Hero/>
            <Footer/>
        </>
    );
};