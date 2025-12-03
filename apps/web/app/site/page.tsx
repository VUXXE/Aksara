import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AIDemo } from "@/components/landing/ai-demo";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      <Hero />
      <Features />
      <AIDemo />
    </main>
  );
}
