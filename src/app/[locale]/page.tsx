import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Trust from "@/components/Trust";
import Contact from "@/components/Contact";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Trust />
      <Contact />
    </main>
  );
}
