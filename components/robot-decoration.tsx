"use client"

export function RobotDecoration({ side = "left" }: { side?: "left" | "right" }) {
  const isLeft = side === "left"

  return (
    <div
      className={`absolute ${isLeft ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 ${isLeft ? "-translate-x-1/2" : "translate-x-1/2"} pointer-events-none hidden lg:block`}
    >
      <div className="relative w-52 h-56 animate-float">
        {/* Floating shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-3 bg-primary/20 rounded-full blur-md" />

        {/* Main robot body */}
        <div className="relative w-full h-full">
          {/* Left arm */}
          <div className="absolute left-0 top-28 w-12 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-primary shadow-lg rotate-12 origin-top">
            <div className="absolute inset-2 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl" />
          </div>

          {/* Right arm - waving */}
          <div className="absolute right-0 top-20 w-12 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-primary shadow-lg -rotate-45 origin-top animate-wave">
            <div className="absolute inset-2 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl" />
          </div>

          {/* Main body container */}
          <div className="absolute left-1/2 top-8 -translate-x-1/2 w-36 h-44">
            {/* Top head section with blue panel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-8 bg-gradient-to-br from-primary via-blue-500 to-primary rounded-t-3xl border-4 border-primary border-b-0 shadow-lg">
              <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-2xl" />
            </div>

            {/* Main white body */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-36 bg-gradient-to-br from-slate-50 to-slate-200 rounded-[2.5rem] border-4 border-primary shadow-2xl overflow-hidden">
              {/* Inner body shading */}
              <div className="absolute inset-3 bg-gradient-to-br from-white/50 to-transparent rounded-[2rem] pointer-events-none" />
              
              {/* Left ear/speaker panel */}
              <div className="absolute -left-6 top-12 w-10 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-primary shadow-lg">
                <div className="absolute inset-2 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl" />
              </div>

              {/* Right ear/speaker panel */}
              <div className="absolute -right-6 top-12 w-10 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-4 border-primary shadow-lg">
                <div className="absolute inset-2 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl" />
              </div>

              {/* Dark blue face screen */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 rounded-3xl border-4 border-primary shadow-inner">
                {/* Screen inner glow */}
                <div className="absolute inset-2 bg-gradient-radial from-blue-800/50 to-transparent rounded-2xl" />
                
                {/* Cute eyes */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
                  {/* Left eye */}
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-0 bg-gradient-radial from-cyan-300 via-cyan-400 to-cyan-500 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse" />
                    <div className="absolute inset-1 bg-gradient-radial from-cyan-200 via-cyan-300 to-cyan-400 rounded-full" />
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white/80 rounded-full" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
                  </div>
                  
                  {/* Right eye */}
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-0 bg-gradient-radial from-cyan-300 via-cyan-400 to-cyan-500 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="absolute inset-1 bg-gradient-radial from-cyan-200 via-cyan-300 to-cyan-400 rounded-full" />
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white/80 rounded-full" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>

                {/* Cute smile */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-6">
                  <svg viewBox="0 0 48 24" fill="none" className="w-full h-full">
                    <path
                      d="M 4 4 Q 24 16 44 4"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-cyan-400"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* Center chest button */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-radial from-cyan-300 via-blue-400 to-blue-500 rounded-full border-4 border-primary shadow-lg shadow-blue-400/50 animate-pulse">
                <div className="absolute inset-1 bg-gradient-radial from-cyan-200 to-cyan-400 rounded-full" />
                <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm" />
              </div>
            </div>

            {/* Bottom body section */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-b-3xl border-4 border-primary border-t-0 shadow-lg">
              <div className="absolute inset-2 bg-gradient-to-br from-slate-200 to-slate-300 rounded-b-2xl" />
              
              {/* Blue bottom accent */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Floating sparkles */}
        <div className="absolute -left-8 top-8 w-3 h-3 bg-primary rounded-full animate-ping opacity-60" />
        <div className="absolute -right-8 top-12 w-2 h-2 bg-accent rounded-full animate-pulse" />
        <div className="absolute left-4 -top-4 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: "2s" }} />
        <div className="absolute right-4 bottom-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
    </div>
  )
}
