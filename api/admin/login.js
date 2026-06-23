export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (expectedUsername && expectedPassword && username === expectedUsername && password === expectedPassword) {
    const token = process.env.ADMIN_TOKEN || 'auth-praveen-token-2026';
    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password' });
}
