import { Link } from 'react-router-dom';
import { pingToBackend } from '../services/api';
import { useEffect } from 'react';

const LandingPage = () => {

  useEffect(() => {
    pingToBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 right-0 p-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-blue-400">CryptoFolio</h1>
        <span className="text-gray-400 text-sm mt-2 sm:mt-0">Track your crypto easily</span>
      </header>

      <main className="flex flex-col items-center justify-center text-center z-10 mt-16 px-4">
        <p className="uppercase tracking-widest text-blue-400 mb-2 text-sm md:text-base animate-fade-in-up">
          Manage your portfolio smarter
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in-up">
          Your Ultimate Crypto Portfolio Manager
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl text-gray-300 animate-fade-in-up animation-delay-200">
          Track, analyze, and manage your digital assets with unparalleled ease and precision. Stay ahead in the crypto market.
        </p>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up animation-delay-400">
          <Link to="/register" className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
            Get Started
          </Link>
          <Link to="/login" className="w-full sm:w-auto text-center bg-transparent border-2 border-blue-500 text-blue-300 font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out">
            Learn More
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-0 p-6 text-gray-400 text-sm text-center w-full">
        &copy; {new Date().getFullYear()} CryptoFolio. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
