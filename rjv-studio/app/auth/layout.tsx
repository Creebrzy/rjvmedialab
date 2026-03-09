export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-rjv-black flex items-center justify-center p-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />
      <div
        className="pointer-events-none fixed top-[-300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }}
      />
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
