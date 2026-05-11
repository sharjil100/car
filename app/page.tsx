import ShowroomHero from "@/components/showroom/ShowroomHero";
import CategoryShowcase from "@/components/showroom/CategoryShowcase";
import FeaturedVehicle from "@/components/showroom/FeaturedVehicle";
import CarGrid from "@/components/showroom/CarGrid";
import WhyUs from "@/components/showroom/WhyUs";
import BrandsStrip from "@/components/showroom/BrandsStrip";
import Footer from "@/components/showroom/Footer";

export default function Page() {
  return (
    <main>
      <ShowroomHero />
      <CategoryShowcase />
      <FeaturedVehicle />
      <CarGrid />
      <WhyUs />
      <BrandsStrip />
      <Footer />
    </main>
  );
}
