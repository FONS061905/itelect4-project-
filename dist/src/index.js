// Variables with explicit types
const projectName = "itelect4-project";
const currentYear = 2026;
const isFullStack = true;
const nothing = null;
const notSet = undefined;
// Function: typed parameters + typed return value
function greet(name, year) {
    return `Welcome to ${name} -- AY ${year}!`;
}
// void: function that does NOT return a value
function logMessage(message) {
    console.log(message);
}
logMessage(greet(projectName, currentYear));
// ===== SPECIAL TYPES =====
// any -- disables TypeScript type checking
// [!] Avoid using this; it defeats the purpose of TypeScript
let anything = "hello";
anything = 42; // No error
anything = true; // No error
// unknown -- the safer version of any
// You MUST check the type before using it
let userInput = "test";
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase()); // OK -- TypeScript knows it's a string here
}
// never -- a function that NEVER returns
// Used when a function always throws an error or loops forever
function throwError(message) {
    throw new Error(message);
}
// ... (your previous code) ...
// ===== USING INTERFACES =====
const student = {
    id: 1,
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: "student",
    isActive: true,
    score: 88,
};
const course = {
    code: "ITELECT4",
    title: "IT Elective 4",
    units: 3,
    semester: "1st Semester 2026-2027",
};
console.log(student);
console.log(course);
export {};
