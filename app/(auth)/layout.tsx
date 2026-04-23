import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary text-white flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-btn/30">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-btn/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-success/10 blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
