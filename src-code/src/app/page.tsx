import { Hero, About, Projects, Technologies, Contact } from "@/components/sections";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Technologies />
      <Projects />
      <Contact />
    </main>
  );
}
