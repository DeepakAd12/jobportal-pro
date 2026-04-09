import { useDarkMode, DarkModeContext } from './useDarkMode';

// Provider Component
export const DarkModeProvider = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
