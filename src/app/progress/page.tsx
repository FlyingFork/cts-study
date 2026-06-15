import { getCourses } from "@/lib/content";
import { ProgressView } from "@/components/progress/ProgressView";

export default function Page() {
  return <ProgressView courses={getCourses()} />;
}
