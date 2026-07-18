// Using them
const studentId = "S2026-001";
const position = { x: 10, y: 20 };
const formatScore = (value) => `${value}%`;
console.log(studentId); // S2026-001
console.log(formatScore(95.5)); // 95.5%
// Function that accepts a union type
export function printId(id) {
    console.log(`ID: ${id}`);
}
printId(101);
printId("S2026-001");
const topStudent = {
    id: 1, name: "Maria Santos", email: "m@example.com",
    role: "student", isActive: true, score: 98,
    enrolledCourse: { code: "ITELECT4", title: "IT Elective 4", units: 3, semester: "1st" },
    gpa: 1.25,
};
