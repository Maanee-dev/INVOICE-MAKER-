
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Fatal: Root element not found.");
} else {
  try {
    // Clear any loading states
    rootElement.innerHTML = '';
    
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log("Kurevi Finance Studio: Successfully mounted.");
  } catch (fatalError) {
    console.error("React Render Error:", fatalError);
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; text-align: center;">
          <h2 style="color: #e11d48;">Unable to start application</h2>
          <p style="color: #64748b;">${fatalError instanceof Error ? fatalError.message : 'Unknown Error'}</p>
        </div>
      `;
    }
  }
}
