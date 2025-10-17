// Test script for invite member API
import axiosConn from "./src/axioscon.js";

async function testInviteAPI() {
  try {
    console.log("Testing invite member API...");
    
    const testData = {
      courseId: 1, // Replace with actual course ID
      userId: 1,   // Replace with actual user ID
      orgId: null,
      invites: [
        {
          email: "test@example.com",
          accessLevel: "SHARED",
          message: "Welcome to our course!"
        }
      ]
    };

    const response = await axiosConn.post("/course-access/inviteUser", testData);
    
    console.log("✅ API Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Run the test
testInviteAPI();