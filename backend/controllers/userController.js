import { readDb, writeDb } from '../data/dbHelper.js';

export const getAllUsers = (req, res) => {
  try {
    const db = readDb();
    const safeUsers = db.users.map(({ password, ...u }) => u);
    return res.status(200).json({ success: true, count: safeUsers.length, data: safeUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const user = db.users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...safeUser } = user;
    return res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, title, avatar } = req.body;

    const db = readDb();
    const index = db.users.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) db.users[index].name = name;
    if (company) db.users[index].company = company;
    if (title) db.users[index].title = title;
    if (avatar) db.users[index].avatar = avatar;

    writeDb(db);
    const { password, ...safeUser } = db.users[index];
    return res.status(200).json({ success: true, message: 'User updated', data: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
