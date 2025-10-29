import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center gap-2 shrink-0 p-4">
      <Loader2Icon className="animate-spin" />
      <h1>Loading...</h1>
    </div>
  );
}
