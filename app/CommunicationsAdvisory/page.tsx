// app/advisory/page.tsx
import Header from "./components/Header";
import BridgeStatement from "./components/BridgeStatement";
import ConsiderThisIf from "./components/ConsiderThisIf";
import WhatAdvisoryIncludes from "./components/WhatAdvisoryIncludes";
import HowEngagementRuns from "./components/HowEngagementRuns";
import FAQ from "./components/FAQ";
import CTASection from "./components/CTASection";

export default function AdvisoryPage() {
  return (
    <main>
      <Header />
      <BridgeStatement />
      <ConsiderThisIf />
      <WhatAdvisoryIncludes />
      <HowEngagementRuns />
      <FAQ />
      <CTASection />
    </main>
  );
}