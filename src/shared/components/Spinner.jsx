import React from 'react';

export function Spinner({ fullScreen = false }) {
  const wrapperClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-tertiary to-orange-100"
    : "flex justify-center items-center p-8";

  return (
    <div className={wrapperClasses}>
      <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
