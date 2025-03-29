import { FileUpload } from "@/components/file-upload";
import { VideoPreview } from "@/components/video-preview";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="max-w-[1000px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-20 text-slate-900 dark:text-slate-50">
          LabHakar AI - Educational Video Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Video Preview */}
          <div className="flex justify-center lg:justify-start ">
            <VideoPreview />
          </div>

          {/* Right side - Content Input */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 ">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-50">
              Create Your Educational Video
            </h2>

            <div className="space-y-6">
              <FileUpload />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
