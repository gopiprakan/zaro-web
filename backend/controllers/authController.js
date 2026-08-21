import { readDb, writeDb } from '../data/dbHelper.js';

export const login = (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const db = readDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: `zaro-jwt-${user.id}-${Date.now()}`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const signup = (req, res) => {
  try {
    const { email, password, name, role = 'client', company, title } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const db = readDb();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'User already exists with this email.' });
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      email: email.toLowerCase(),
      password,
      name,
      role,
      company: company || 'ZARO Member',
      title: title || 'Specialist',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name || email}`,
      balance: 0,
      totalSpent: 0,
      totalEarned: 0,
      status: 'Active',
      verified: false,
      joined: new Date().toISOString().split('T')[0]
    };

    db.users.push(newUser);
    writeDb(db);

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword,
      token: `zaro-jwt-${newUser.id}-${Date.now()}`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const demoLogin = (req, res) => {
  try {
    const { role = 'client' } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.role === role) || db.users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo user not found.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      success: true,
      message: `Demo login as ${role}`,
      user: userWithoutPassword,
      token: `zaro-demo-${user.id}`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getMe = (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter required.' });
    }

    const db = readDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
