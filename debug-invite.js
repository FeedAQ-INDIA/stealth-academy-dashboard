// Debug test for invite functionality
console.log("=== Testing invite functionality ===");

// Test data
const testData = {
  courseId: 123,
  invites: [
    {
      email: "test@example.com", 
      accessLevel: "SHARED",
      message: "Welcome!"
    }
  ],
  options: {
    userId: 1,
    orgId: null
  }
};

console.log("Test data:", testData);

// Simulate the validation from courseRoomService
function validateInviteData(courseId, invites, options = {}) {
  console.log("Validating:", { courseId, invites, options });
  
  if (!courseId) {
    throw new Error("Course ID is required");
  }
  
  if (!Array.isArray(invites)) {
    throw new Error("Invites must be an array");
  }
  
  if (invites.length === 0) {
    throw new Error("At least one invite is required");
  }
  
  // Validate invites structure
  for (const invite of invites) {
    if (!invite.email || !invite.accessLevel) {
      throw new Error("Each invite must have email and accessLevel");
    }
  }
  
  console.log("✅ Validation passed!");
  return true;
}

try {
  validateInviteData(testData.courseId, testData.invites, testData.options);
  console.log("✅ All tests passed!");
} catch (error) {
  console.error("❌ Test failed:", error.message);
}

// Test edge cases
console.log("\n=== Testing edge cases ===");

// Test with empty courseId
try {
  validateInviteData(null, testData.invites, testData.options);
} catch (error) {
  console.log("✅ Correctly caught empty courseId:", error.message);
}

// Test with empty invites
try {
  validateInviteData(testData.courseId, [], testData.options);
} catch (error) {
  console.log("✅ Correctly caught empty invites:", error.message);
}

// Test with non-array invites
try {
  validateInviteData(testData.courseId, "not-an-array", testData.options);
} catch (error) {
  console.log("✅ Correctly caught non-array invites:", error.message);
}