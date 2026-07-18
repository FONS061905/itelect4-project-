// 1. getUser function with typed parameters and User object return type
function getUser(id) {
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
function calculateGrade(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90)
        return "A";
    if (percentage >= 80)
        return "B";
    if (percentage >= 70)
        return "C";
    return "F";
}
// 3. formatCourse function with explicit parameter types and explicit string return
function formatCourse(name, units, semester) {
    return `${name} (${units} units) - ${semester}`;
}
// ===== Execution and Testing =====
const user = getUser(1);
console.log(user);
const grade = calculateGrade(85, 100);
console.log(grade); // Output: B
const courseDetails = formatCourse("IT Elective 4", 3, "1st Semester");
console.log(courseDetails); // Output: IT Elective 4 (3 units) - 1st Semester
export {};
