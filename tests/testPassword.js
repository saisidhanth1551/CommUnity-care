import bcrypt from 'bcryptjs';

const testPassword = async () => {
  const password = 'password123'; // Test password
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Log the hashed password
  console.log("Hashed Password:", hashedPassword);
  
  // Compare the plain password with the hashed password
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log("Password match:", isMatch); // Should return 'true'
};

// Run the test
testPassword();
