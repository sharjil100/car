import { CARS } from "@/data/cars";
import CarDetail from "@/components/showroom/CarDetail";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CARS.map((car) => ({ id: car.id }));
}

export default function CarPage({ params }: { params: { id: string } }) {
  const car = CARS.find((c) => c.id === params.id);
  if (!car) notFound();
  return <CarDetail car={car} />;
}
