// ===== PRIMITIVE TYPE ANNOTATIONS =====
// At the TOP of src/index.ts
import type { ApiResponse, User, Course, Submission } from "../types/index";
// Variables with explicit types
const projectName: string = "itelect4-project";
const currentYear: number = 2026;
const isFullStack: boolean = true;
const nothing: null = null;
const notSet: undefined = undefined;
// Function: typed parameters + typed return value
function greet(name: string, year: number): string {
return `Welcome to ${name} -- AY ${year}!`;
}
// void: function that does NOT return a value
function logMessage(message: string): void {
console.log(message);
}
logMessage(greet(projectName, currentYear));
// ===== SPECIAL TYPES =====
// any -- disables TypeScript type checking
// [!] Avoid using this; it defeats the purpose of TypeScript
let anything: any = "hello";
anything = 42; // No error
anything = true; // No error
// unknown -- the safer version of any
// You MUST check the type before using it
let userInput: unknown = "test";
if (typeof userInput === "string") {
console.log(userInput.toUpperCase()); // OK -- TypeScript knows it's a string here
}
// never -- a function that NEVER returns
// Used when a function always throws an error or loops forever
function throwError(message: string): never {
throw new Error(message);
}
// ... (your previous code) ...
// ===== USING INTERFACES =====
const student: User = {
id: 1,
name: "Juan dela Cruz",
email: "juan@example.com",
role: "student",
isActive: true,
score: 88,
};
const course: Course = {
code: "ITELECT4",
title: "IT Elective 4",
units: 3,
semester: "1st Semester 2026-2027",
};

const userResponse: ApiResponse<User> = {
  success: true,
  data: student,
};

const courseResponse: ApiResponse<Course[]> = {
  success: true,
  data: [course],
};

console.log(userResponse.data.name); // Juan dela Cruz
console.log(courseResponse.data[0].title); // IT Elective 4

console.log(student);
console.log(course);
