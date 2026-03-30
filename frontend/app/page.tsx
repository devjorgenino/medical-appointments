import dynamic from 'next/dynamic'

// Dynamically import the React app to avoid SSR issues with browser-only code
const AppContent = dynamic(
  () => import('../src/utils/routes').then((mod) => ({ default: mod.AppContent })),
  { ssr: false }
)

export default function Page() {
  return (
    <div className="min-h-screen">
      <AppContent />
    </div>
  )
}
