import type { User } from "../types/index";

// 1. getUser function with typed parameters and User object return type
function getUser(id: number): User {
    return {
        id: id,
        name: "Juan dela Cruz",
        email: "juan@example.com",
        role: "student",
        isActive: true,
        score: 95.5,
    };
}

// 2. calculateGrade function with numeric inputs and a string return type
function calculateGrade(score: number, maxScore: number): string {
    const percentage: number = (score / maxScore) * 100;

    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    
    return "F";
}

// 3. formatCourse function with explicit parameter types and explicit string return
function formatCourse(name: string, units: number, semester: string): string {
    return `${name} (${units} units) - ${semester}`;
}

// ===== Execution and Testing =====

const user: User = getUser(1);
console.log(user);

const grade: string = calculateGrade(85, 100);
console.log(grade); // Output: B

const courseDetails: string = formatCourse("IT Elective 4", 3, "1st Semester");
console.log(courseDetails); // Output: IT Elective 4 (3 units) - 1st Semester