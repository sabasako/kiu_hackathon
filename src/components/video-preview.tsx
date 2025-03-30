// import { Phone } from "lucide-react";

// export function VideoPreview({ isLoading }: { isLoading: boolean }) {
//   return (
//     <div className="relative w-[280px] h-[560px] bg-black rounded-[36px] border-[8px] border-slate-800 shadow-xl overflow-hidden">
//       {/* Phone notch */}
//       <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-10"></div>

//       {/* Video placeholder with loading state */}
//       <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400">
//         {isLoading ? (
//           <div className="flex flex-col items-center space-y-4">
//             {/* Loading spinner */}
//             <div className="h-12 w-12 rounded-full border-4 border-slate-600 border-t-blue-500 animate-spin"></div>

//             {/* Loading text */}
//             <p className="text-sm text-center px-6 animate-pulse">
//               Generating your educational video...
//             </p>

//             {/* Loading progress bars */}
//             <div className="w-3/4 space-y-2 mt-4">
//               <div className="h-1 bg-slate-800 rounded overflow-hidden">
//                 <div className="h-full bg-blue-500 animate-[loadingBar_2s_ease-in-out_infinite]"></div>
//               </div>
//               <div className="h-1 bg-slate-800 rounded overflow-hidden">
//                 <div className="h-full bg-green-500 animate-[loadingBar_2.5s_ease-in-out_infinite]"></div>
//               </div>
//               <div className="h-1 bg-slate-800 rounded overflow-hidden">
//                 <div className="h-full bg-purple-500 animate-[loadingBar_1.7s_ease-in-out_infinite]"></div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <>
//             <Phone size={48} className="mb-4 opacity-50" />
//             <p className="text-sm text-center px-6">
//               Your educational video will appear here after processing
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { Phone } from "lucide-react";
import { Layers2 } from "lucide-react";

export function VideoPreview({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="relative w-[280px] h-[560px] bg-black rounded-[36px] border-[8px] border-slate-800 shadow-xl overflow-hidden">
      {/* Phone notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-10"></div>

      {/* Video or Loading state */}
      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            {/* Loading spinner */}
            <div className="h-12 w-12 rounded-full border-4 border-slate-600 border-t-blue-500 animate-spin"></div>

            <>
              {/* <Phone size={48} className="mb-4 opacity-50" /> */}
              <Layers2 size={48} className="mb-4 opacity-50" />
              <p className="text-sm text-center px-6">
                Your educational video will appear here after processing
              </p>
            </>

            {/* Loading progress bars */}
            <div className="w-3/4 space-y-2 mt-4">
              <div className="h-1 bg-slate-800 rounded overflow-hidden">
                <div className="h-full bg-blue-500 animate-[loadingBar_2s_ease-in-out_infinite]"></div>
              </div>
              <div className="h-1 bg-slate-800 rounded overflow-hidden">
                <div className="h-full bg-green-500 animate-[loadingBar_2.5s_ease-in-out_infinite]"></div>
              </div>
              <div className="h-1 bg-slate-800 rounded overflow-hidden">
                <div className="h-full bg-purple-500 animate-[loadingBar_1.7s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        ) : (
          <video className="w-full h-full" controls>
            <source
              src="https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/2w0o0bc7yb/08772e7b-db8b-4cc7-908a-2e4d22febbe8.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
