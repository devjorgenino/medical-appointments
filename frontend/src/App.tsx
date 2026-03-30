import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContent } from "@utils/routes";
import { ThemeProvider } from "@components/providers/ThemeProvider";
import { QueryProvider } from "@components/providers/QueryProvider";
import "./index.css";

const App: React.FC = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
