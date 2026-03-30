import { createRoot } from "react-dom/client"
import { Toaster } from "sonner"
import "./index.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster position="bottom-right" 
             duration={4000}
             richColors closeButton />
  </>,
)
