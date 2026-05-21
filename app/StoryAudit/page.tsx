import Header from "@/app/StoryAudit/components/Header"; // Import the Header component
import ProblemStatement from "@/app/StoryAudit/components/ProblemStatement"; // Import the Header component
import WhatIsReviewed from "./components/WhatIsReviewed";
import ConsiderThisIf from "@/app/StoryAudit/components/ConsiderThisIf"; 
import WhatYouGet from "./components/WhatYouGet";
import Timeline from "./components/Timeline";
import Outcomes from "./components/Outcomes";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTASection from "./components/CTASection"
import Footer from "@/app/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ProblemStatement />
      <ConsiderThisIf />
      <WhatIsReviewed />
      <WhatYouGet />
      <Timeline />
      <Outcomes />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}