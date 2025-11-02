import { testAPI, weatherAPI } from './utils/api';

// Test the API
console.log('Current Provider:', weatherAPI.getProvider());

testAPI().then(success => {
  if (success) {
    console.log('🎉 Weather API is working!');
  } else {
    console.log('⚠️ Please check your API keys');
  }
});