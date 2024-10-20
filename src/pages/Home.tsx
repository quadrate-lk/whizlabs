import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to AzureCertPrep</h1>
      <p className="text-xl mb-8">Prepare for your Azure certification exams with our comprehensive mock tests.</p>
      <Link
        to="/exams"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center"
      >
        Start Practicing
        <ArrowRight className="ml-2" />
      </Link>
    </div>
  );
};

export default Home;