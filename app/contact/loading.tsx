import Shimmer from "@/components/ui/Shimmer";

export default function ContactLoading() {
  return (
    <div className="pt-[80px]">
      <section className="min-h-[calc(100vh-80px)] flex items-center py-12 lg:py-16">
        <div className="w-full mx-auto px-6 lg:px-10 max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[45%_55%] lg:items-center">
            {/* Left — Image shimmer */}
            <div className="relative h-[50vh] lg:h-[70vh] overflow-hidden rounded-[12px]">
              <Shimmer className="h-full w-full" />
            </div>

            {/* Right — Content shimmer */}
            <div className="flex flex-col justify-center space-y-6">
              <Shimmer className="h-3 w-20 rounded-full" />
              <Shimmer className="h-12 w-64 rounded-md" />
              <Shimmer className="h-20 w-full max-w-[500px] rounded-md" />
              <div className="space-y-4 pt-4">
                <Shimmer className="h-12 w-full rounded-[10px]" />
                <Shimmer className="h-12 w-full rounded-[10px]" />
                <Shimmer className="h-12 w-full rounded-[10px]" />
                <Shimmer className="h-28 w-full rounded-[10px]" />
                <Shimmer className="h-12 w-48 rounded-full mt-6" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
