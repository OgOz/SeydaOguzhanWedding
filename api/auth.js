export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    const ENV_USER = process.env.ADMIN_USERNAME;
    const ENV_PASS = process.env.ADMIN_PASSWORD;

    if (!ENV_USER || !ENV_PASS) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (username === ENV_USER && password === ENV_PASS) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
}
