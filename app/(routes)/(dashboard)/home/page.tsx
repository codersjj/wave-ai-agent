import { generateUUID } from "@/lib/utils";
import MainSection from "./_common/main-section";

export default function HomePage() {
  const id = generateUUID();
  return (
    <div className="flex flex-col gap-4">
      <MainSection key={id} id={id} />
    </div>
  );
}
