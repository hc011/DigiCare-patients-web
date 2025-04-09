/**
 * Navigation utilities for the application
 */

/**
 * Checks if the browser can navigate back in history
 * @returns {boolean} True if there is a page to go back to
 */
export const canNavigateBack = () => {
    return window.history.length > 1;
};

/**
 * Gets the previous page URL if available
 * @returns {string|null} The previous page URL or null if not available
 */
export const getPreviousPageUrl = () => {
    return document.referrer || null;
};

/**
 * Navigate back in browser history
 * @param {Function} navigate - React Router's navigate function
 */
export const goBack = (navigate) => {
    navigate(-1);
};

/**
 * Set page title with optional prefix/suffix
 * @param {string} title - Main page title
 * @param {string} appName - Optional app name to append
 */
export const setPageTitle = (title, appName = 'DigiCare') => {
    document.title = title ? `${title} | ${appName}` : appName;
};