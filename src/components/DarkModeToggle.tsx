import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode ? JSON.parse(savedMode) : systemDark);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    darkMode ? html.classList.add('dark') : html.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-gray-600"
    >
      <span
        className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-gray-200
          ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}
      >
        <FontAwesomeIcon 
          icon={darkMode ? faMoon : faSun}
          className={`absolute inset-0 m-auto text-sm transition-colors
            ${darkMode ? 'text-gray-600' : 'text-yellow-500'}`}
        />
      </span>
    </button>
  );
};

export default DarkModeToggle;