// Replace brackets and parentheses with brackets
// Then replace non-bracket-non-number chars with spaces
export function normalizeInput(input) {
    try {
        input = input.replace(/[{(]/g, '[');
        input = input.replace(/[})]/g, ']');
        input = input.replace(/[^\[\]1234567890\-]+/g, ' ').replace(/[ ]/g, ', ');
        return input;
    } catch(err) {
        throw new Error("Bad Color Grouping Formatting");
    }
}

// Helper function to expand ranges
function expandRanges(input) {
    if (!input.includes('-')){
        return input;
    }
    // Remove brackets and split the input string into groups
    const groups = input.match(/\[([^\]]+)\]/g).map(group => group.replace(/[\[\]]/g, '').split(', '));

    const result = groups.map(group => {
        return group.map(item => {
            if (item.includes('-')) {
                const [start, end] = item.split('-').map(Number);
                if (end < start){
                    throw new Error("Color group range must go from a lower to a higher number");
                }
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            } else {
                return Number(item);
            }
        }).flat();
    });

    // Convert the result array back to the desired string format
    const resultString = result.map(group => `[${group.join(', ')}]`).join(', ');
    
    return resultString;
}

// Remove any entries that are just integers and not arrays
function pruneLooseIntegers(inputArray) {
    for (let i = 0; i < inputArray.length; i++) {
        if (typeof inputArray[i] === 'number') {
            inputArray.splice(i, 1);
            i--;
        }
    }
    return inputArray;
}


// Check if any numbers were put in multiple groups
// or any groups are not arrays. 
// Return relevant error if so
function checkForDuplicates(inputArray) {
    const seenColors = new Set();
    const duplicateColors = new Set();

    for (let i = 0; i < inputArray.length; i++) {
        const group = inputArray[i];

        // Check if the group contains any arrays
        for (let item of group) {
            if (Array.isArray(item)) {
                throw new Error("Cannot put color group inside another color group");
            }

            // Check for duplicate colors
            if (seenColors.has(item)) {
                duplicateColors.add(item);
            } else {
                seenColors.add(item);
            }
        }
    }

    // If there are duplicate colors, throw an error
    if (duplicateColors.size > 0) {
        throw new Error(`Cannot put colors in multiple color groups: (${[...duplicateColors].join(' ')})`);
    }
}

// Main function to process the normalized input
export function processNormalizedInput(input, colorsLength = null) {
    // Input should be from the "normalized input"
    input = expandRanges(input);
    let inputArray;
    try {
        inputArray = JSON.parse("[" + input + "]");
    } catch(err) {
        throw new Error("Bad Color Grouping Formatting");
    }
    inputArray = pruneLooseIntegers(inputArray);
    checkForDuplicates(inputArray);

    if (colorsLength != null) {
        const invalidColors = new Set();
        for (let i = 0; i < inputArray.length; ++i){
            for (let j = 0; j < inputArray[i].length; ++j){
                if (inputArray[i][j] > colorsLength){
                    invalidColors.add(inputArray[i][j]);
                }
            }
        }
        if (invalidColors.size > 0){
            throw new Error(`Color groups contain nonexistant colors: (${[...invalidColors].join(' ')})`);
        }
    }

    return inputArray;
}