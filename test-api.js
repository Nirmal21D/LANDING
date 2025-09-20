// Test script for the search API
const testSearchAPI = async () => {
  const requestBody = {
    user_location: {
      lat: 19.07609,
      lng: 72.877426
    },
    query: "coffee",
    max_distance_km: 50,
    category_filter: "Cafe",
    tag_filters: ["espresso", "wifi"],
    limit: 5
  };

  try {
    console.log('Testing search API with:', requestBody);
    
    const response = await fetch('http://localhost:3001/api/search-businesses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Success! API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testSearchAPI();
}

module.exports = { testSearchAPI };