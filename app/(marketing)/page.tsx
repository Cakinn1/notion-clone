import Footer from "./_components/Footer";
import { Heading } from "./_components/heading";
import Heroes from "./_components/heroes";

export default function MarketingPage() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex px-6 pb-10 flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1">
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
}
