import chroma from 'chroma-js';

// Map to store dynamically generated colors for each facility type
const facilityColorsMap = {};

// Function to generate a color with good contrast
const generateContrastingColor = (existingColors) => {
	let color;
	do {
	color = chroma.random();
	} while (existingColors.some(existingColor => chroma.contrast(color, existingColor) < 4.5));
	return color.hex();
};

// Function to get or generate a color for a facility type
export const getFacilityColor = (type) => {
	if (!facilityColorsMap[type]) {
	facilityColorsMap[type] = generateContrastingColor(Object.values(facilityColorsMap));
	}
	return facilityColorsMap[type];
};

// Export the facility colors map for reference
export const getFacilityColorsMap = () => facilityColorsMap;