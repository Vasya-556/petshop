import React, { createContext, useState, useContext } from 'react';

const VisibilityContext = createContext();

export const VisibilityProvider = ({ children }) => {
  const [componentOneVisible, setComponentOneVisible] = useState(false);
  const [componentTwoVisiblePart, setComponentTwoVisiblePart] = useState(true);

  const toggleVisibility = () => {
    setComponentOneVisible((prev) => !prev);
    setComponentTwoVisiblePart((prev) => !prev);
  };

  const showComponentOneHideComponentTwo = () => {
    setComponentOneVisible(true);
    setComponentTwoVisiblePart(false);
  };

  const hideComponentOneShowComponentTwo = () => {
    setComponentOneVisible(false);
    setComponentTwoVisiblePart(true);
  };

  return (
    <VisibilityContext.Provider value={{ componentOneVisible, componentTwoVisiblePart, toggleVisibility, showComponentOneHideComponentTwo, hideComponentOneShowComponentTwo }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = () => useContext(VisibilityContext);
