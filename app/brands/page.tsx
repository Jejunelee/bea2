import Header from "@/app/brands/components/Header"; // Import the Header component
import Packages from "@/app/brands/components/Packages"
import WorkedWith from "@/app/brands/components/WorkedWith"
import Footer from "@/app/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Packages />
      <WorkedWith />
      <Footer />
    </div>
  );
}