import Header from "@/app/components/Header"; // Import the Header component
import Contact from "./components/Contact"; // Import the Header component

import Footer from "@/app/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Contact />
      <Footer />
    </div>
  );
}