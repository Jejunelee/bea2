import Header from "@/app/StoryFoundation/components/Header";
import BridgeStatement from "./components/BridgeStatement";
import Footer from "@/app/components/Footer"
import ConsiderThisIf from "./components/ConsiderThisIf";
import WhatYouGet from "./components/WhatYouGet";
import WhatYouWalkAwayWith from "./components/WhatYouWalkAwayWith";
import HowThisWorks from "./components/HowThisWorks";
import FAQ from "./components/FAQ";
import HowItRuns from "./components/HowItRuns";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BridgeStatement />
      <ConsiderThisIf />
      <HowItRuns />
      <WhatYouGet />
      <WhatYouWalkAwayWith />
      <HowThisWorks />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}