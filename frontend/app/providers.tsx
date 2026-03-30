import { BrowserRouter as Router } from 'react-router-dom'

export function Providers({ children }: { children: React.ReactNode }) {
  return <Router>{children}</Router>
}
