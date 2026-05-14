import { CursorTrail } from "@/components/ambient/cursor-trail";
import { AiRecommendationEngine } from "@/components/sections/ai-recommendation-engine";
import { AiSymptomAssistant } from "@/components/sections/ai-symptom-assistant";
import { EmergencyResponseMode } from "@/components/sections/emergency-response-mode";
import { HealthMetricsVisualization } from "@/components/sections/health-metrics-visualization";
import { HeroSection } from "@/components/sections/hero-section";
import { RiskIntelligenceDashboard } from "@/components/sections/risk-intelligence-dashboard";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function Home() {
  return (
    <>
      <CursorTrail />
      <SiteHeader />
      <main className="relative">
        <HeroSection />
        <AiSymptomAssistant />
        <RiskIntelligenceDashboard />
        <HealthMetricsVisualization />
        <AiRecommendationEngine />
        <EmergencyResponseMode />
      </main>
      <SiteFooter />
    </>
  );
}
