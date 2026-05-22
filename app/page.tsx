import Header from "./components/Header";
import Hero from "./components/Hero"
import Section from "./components/Section"
import Ticker from "./components/Ticker"
import Familiar from "./components/Familiar";
import Quote from "./components/Quote";
import AboutMe from "./components/AboutMe";
import Stats from "./components/Stats"
import Content from "./components/Content"
import Latest from "./components/Latest"
import Belief from "./components/Belief"
import GetStarted from "./components/GetStarted"
import Packages from "./components/Packages"
import Footer from "./components/Footer"
import Newsletter from "./components/Newsletter"
import Testimonial from "./components/Testimonial"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Ticker />
      <Quote />
      <AboutMe />
      <Testimonial />
      <Packages />
      <Newsletter />
      <Footer />
    </div>
  );
}