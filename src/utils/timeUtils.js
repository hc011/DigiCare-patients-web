/**
 * Formats seconds into a human-readable string showing hours and minutes
 * @param {number} seconds - The number of seconds to format
 * @returns {string} Formatted string in the format "x hrs y min"
 */
export const formatSecondsToHoursMinutes = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return '0 hrs 0 min';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
        return `${minutes} min`;
    }

    return `${hours} hrs ${minutes} min`;
}; 