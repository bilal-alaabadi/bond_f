import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { LangProvider } from "./LangContext"; // نامد اكسبورت

function App() {
  return (
    <LangProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </LangProvider>
  );
}

export default App;
