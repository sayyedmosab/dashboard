/**
 * Retrieves the computed value of a CSS custom property from the root element.
 * @param varName The name of the CSS custom property (e.g., '--component-text-accent').
 * @returns The computed value of the property (e.g., '#00AEEF').
 */
export const getCssVar = (varName: string): string => {
    if (typeof window === 'undefined') {
        return ''; // Return empty string in non-browser environments
    }
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};
