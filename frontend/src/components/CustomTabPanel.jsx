import React from 'react';

const CustomTabPanel = ({ value, index, children }) => {
  
  return (
    <div
      key={index}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default CustomTabPanel;