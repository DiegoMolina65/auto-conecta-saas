import React from 'react';

export const Textarea = ({ children, className, ...props }) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none ${className}`}
      {...props}
    />
  );
};
