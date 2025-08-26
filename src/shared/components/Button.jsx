import React from "react";

// CSS styles as a string to be injected
const buttonStyles = `
.btn {
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;
  outline: none;
  font-family: system-ui, -apple-system, sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn:focus {
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):active {
  transform: scale(0.95);
}

/* Variants */
.btn-primary {
  background-color: #374151;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover:not(:disabled) {
  background-color: #1f2937;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-primary:focus {
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.3);
}

.btn-secondary {
  background-color: #dc2626;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover:not(:disabled) {
  background-color: #b91c1c;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-secondary:focus {
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.3);
}

.btn-outline {
  border: 2px solid #374151;
  color: #374151;
  background-color: white;
}

.btn-outline:hover:not(:disabled) {
  background-color: #374151;
  color: white;
}

.btn-outline:focus {
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.3);
}

.btn-ghost {
  color: #374151;
  background-color: white;
}

.btn-ghost:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.btn-ghost:focus {
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.3);
}

.btn-tertiary {
  background-color: #fed7aa;
  color: #374151;
  border: 1px solid #fdba74;
}

.btn-tertiary:hover:not(:disabled) {
  background-color: #ffedd5;
}

.btn-tertiary:focus {
  box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.3);
}

.btn-success {
  background-color: #16a34a;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-success:hover:not(:disabled) {
  background-color: #15803d;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-success:focus {
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.3);
}

.btn-edit {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-edit:hover:not(:disabled) {
  background-color: #1d4ed8;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.btn-edit:focus {
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.3);
}

/* Sizes */
.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}

.btn-md {
  padding: 12px 16px;
  font-size: 16px;
  min-height: 48px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 18px;
  min-height: 56px;
}

.btn-xl {
  padding: 20px 40px;
  font-size: 20px;
  min-height: 64px;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('button-styles');
  if (!styleElement) {
    const style = document.createElement('style');
    style.id = 'button-styles';
    style.textContent = buttonStyles;
    document.head.appendChild(style);
  }
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      {...props}
    >
      {children}
    </button>
  );
}
