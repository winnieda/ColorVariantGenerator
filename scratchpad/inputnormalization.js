// Replace brackets and parentheses with brackets
// Then replace non-bracket-non-number chars with spaces
function normalizeInput(input) {
    console.log("before normalize: ", input);
    input = input.replace(/[{(]/g, '[');
    input = input.replace(/[})]/g, ']');
    input = input.replace(/[^\[\]1234567890\-]+/g, ' ').replace(/[ ]/g, ', ');
    console.log("after normalize: ", input);
    return input;
}

// Helper function to expand ranges
function expandRanges(input) {
    // Remove brackets and split the input string into groups
    const groups = input.match(/\[([^\]]+)\]/g).map(group => group.replace(/[\[\]]/g, '').split(', '));

    const result = groups.map(group => {
        return group.map(item => {
            if (item.includes('-')) {
                const [start, end] = item.split('-').map(Number);
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
// Main function to process the input
function processInput(input) {
    // Normalize the input
    input = normalizeInput(input);
    input = expandRanges(input);
    inputArray = JSON.parse("[" + input + "]");

    console.log("after parsing; ", inputArray);

    return inputArray;
}

// Test the function with the given examples
let input1 = "[1, 3, 4, 5], [2, 6]";
let input2 = "(1, 3, 4, 5), (2, 6)";
let input3 = "{1, 3, 4, 5}, {2, 6}";
let input4 = "[1 3 4 5] [2 6]";
let input5 = "[1, 3-5], [2, 6]";
let input6 = "[1, 3, 4, 5], [2, 6] [7]";
let input7 = "[1, 3, 4, 5], [2, 6] 7";
let input8 = "[1;v3_4!.5], [2?6]";

console.log(processInput(input1)); // Expected output: [1, 3, 4, 5] [2, 6]
console.log(processInput(input2));
console.log(processInput(input3));
console.log(processInput(input4));
console.log(processInput(input5));
console.log(processInput(input6));
console.log(processInput(input7));
console.log(processInput(input8));