export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, role = 'admin' } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required'});
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'});
  }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address'});
  }

    // For development, we'll just return success
    // In production, this would create the user in Firebase Auth and Firestore
    const user = {
      id: Date.now().toString(),
      email: email,
      name: name,
      role: role,
      createdAt: new Date().toISOString()};

    res.status(200).json({
      success: true,
      message: 'User created successfully (development mode)',
      user: {
    id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
  }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'});
  }
}
