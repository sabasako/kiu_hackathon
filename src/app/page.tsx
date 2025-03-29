import { Content } from "@/components/content";
import { VideoPreview } from "@/components/video-preview";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="max-w-[1000px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-20 text-slate-900 dark:text-slate-50">
          LabHakar AI - Educational Video Generator
        </h1>

        <Content />
      </main>
    </div>
  );
}
