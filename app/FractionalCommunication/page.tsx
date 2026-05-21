// app/fractional/page.tsx
import FractionalHero from "./components/Header";
import BridgeStatement from "./components/BridgeStatement";
import ConsiderThisIf from "./components/ConsiderThisIf";
import WhatIRun from "./components/WhatIRun";
import HowEngagementRuns from "./components/HowEngagementRuns";
import WhatYouGet from "./components/WhatYouGet";
import HowThisWorks from "./components/HowThisWorks";
import CaseStudies from "./components/CaseStudies";
import FAQ from "./components/FAQ";
import CTASection from "./components/CTASection";

export default function FractionalPage() {
  return (
    <main>
      <FractionalHero />
      <BridgeStatement />
      <ConsiderThisIf />
      <WhatIRun />
      <HowEngagementRuns />
      <WhatYouGet />
      <HowThisWorks />
      <CaseStudies />
      <FAQ />
      <CTASection />
    </main>
  );
}