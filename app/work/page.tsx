import Header from "@/app/work/components/Header"; // Import the Header component

import Section1 from "@/app/work/components/Section1"
import Footer from "@/app/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Section1 />
      <Footer />
    </div>
  );
}