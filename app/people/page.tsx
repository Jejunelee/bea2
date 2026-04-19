import Header from "@/app/people/components/Header"; // Import the Header component
import Section1 from "@/app/people/components/Section1"
import Section2 from "@/app/people/components/Section2"
import Section3 from "@/app/people/components/Section3"
import Footer from "@/app/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Section1 />
      <Section2 />
      <Section3 />
      <Footer />
    </div>
  );
}