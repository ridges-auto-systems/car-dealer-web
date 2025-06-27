// Simple API connection test
export async function testApiConnection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("API URL not configured");
    return false;
  }

  try {
    // Test the basic API endpoint
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("✅ API Connection successful:", data);
    return true;
  } catch (error) {
    console.error("❌ API Connection failed:", error);
    return false;
  }
}
