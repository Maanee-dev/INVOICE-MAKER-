
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * APPLICATION ENTRY POINT
 * 
 * If you see a white screen:
 * 1. Open Browser Console (F12) to check for JavaScript errors.
 * 2. Verify all assets (JS/CSS) returned status 200 in the Network tab.
 * 3. Ensure the 'dist' folder contents were uploaded correctly.
 */

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMsg = "Mount Error: Root element 'root' not found in index.html.";
  console.error(errorMsg);
  // Fallback UI to body if the mount point is missing
  document.body.innerHTML = `
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif; background: #f8fafc; color: #1e293b; text-align: center;">
      <div style="background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; max-width: 400px;">
        <div style="background: #fee2e2; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          <svg style="width: 24px; height: 24px; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 style="margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 700;">Initialization Failed</h1>
        <p style="color: #64748b; font-size: 0.875rem; line-height: 1.5;">${errorMsg}</p>
      </div>
    </div>
  `;
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (fatalError) {
    console.error("React failed to render:", fatalError);
    rootElement.innerHTML = `
      <div style="padding: 2rem; color: #ef4444; font-family: sans-serif;">
        <strong>Application Crash:</strong> ${fatalError instanceof Error ? fatalError.message : String(fatalError)}
        <br/><br/>
        Please check the browser console for the full stack trace.
      </div>
    `;
  }
}
