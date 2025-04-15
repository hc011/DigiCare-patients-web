import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
  // </StrictMode>
);

// Comment out the unregister code and activate the service worker registration
// Unregister any existing service workers to prevent caching
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.getRegistrations().then((registrations) => {
//     for (let registration of registrations) {
//       registration.unregister();
//       console.log("Service Worker unregistered");
//     }
//   });
// }

// Register service worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
