const euclideanDistance = (a, b) => {
    // ❗ Safety checks
    if (!a || !b) return Infinity;

    if (!Array.isArray(a) || !Array.isArray(b)) {
        console.error("Descriptors must be arrays");
        return Infinity;
    }

    if (a.length !== b.length) {
        console.error("Descriptor length mismatch");
        return Infinity;
    }

    let sum = 0;

    for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }

    return Math.sqrt(sum);
};

module.exports.findBestMatch = (inputDescriptor, students) => {
    if (!inputDescriptor || !students?.length) {
        return null;
    }

    let bestMatch = null;
    let minDistance = Infinity;

    for (let student of students) {
        // ❗ Now descriptors is a SINGLE array
        if (!student.descriptors || !Array.isArray(student.descriptors)) continue;

        const dist = euclideanDistance(
            inputDescriptor,
            student.descriptors // ✅ direct comparison
        );

        console.log(student.studentName, "distance:", dist);

        if (dist < minDistance) {
            minDistance = dist;
            bestMatch = student;
        }
    }

    console.log("Best distance:", minDistance);

    // ✅ Apply threshold AFTER finding best match
    if (minDistance < 0.6) {
        return bestMatch;
    }

    return null;
};