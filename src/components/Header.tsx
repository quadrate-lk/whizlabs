import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, BarChart2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <BookOpen className="mr-2" />
          AzureCertPrep
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="flex items-center hover:text-blue-200">
              <Home className="mr-1" size={18} />
              Home
            </Link>
          </li>
          <li>
            <Link to="/exams" className="flex items-center hover:text-blue-200">
              <BookOpen className="mr-1" size={18} />
              Exams
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="flex items-center hover:text-blue-200">
              <BarChart2 className="mr-1" size={18} />
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;