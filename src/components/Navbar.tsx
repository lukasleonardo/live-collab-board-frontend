import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-gray-900 dark:text-white font-bold text-lg">
          <span className="text-primary">🚀 Live Dashboards</span>
        </Link>

        {/* Menu Hamburguer (Mobile) */}
        <button className="md:hidden text-gray-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
        </button>

        {/* Links de Navegação */}
        <div className={`md:flex items-center space-x-6 ${isOpen ? "block" : "hidden"} md:block`}>
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">Home</Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">Sobre</Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">Contato</Link>

          {/* Botões */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline" onClick={toggleTheme} className="rounded-full">
              {darkMode ? <Sun className="h-5 w-5 " /> : <Moon className="h-5 w-5 text-white" />}
            </Button>
            {token ?  <Button onClick={handleLogout}>Logout</Button>: 
            <Button className="bg-primary text-white hover:bg-primary-dark"> Login </Button>}
            
          </div>
        </div>
      </div>
    </nav>
  );
}
