import { readDb, writeDb } from '../data/dbHelper.js';

export const getOrders = (req, res) => {
  try {
    const { email } = req.query;
    const db = readDb();
    let orders = db.orders || [];

    if (email) {
      orders = orders.filter(o => o.userEmail?.toLowerCase() === email.toLowerCase());
    }

    return res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const createOrder = (req, res) => {
  try {
    const { userEmail, projectName, category, price, estDelivery } = req.body;
    if (!projectName || !price) {
      return res.status(400).json({ success: false, message: 'Project name and price are required.' });
    }

    const db = readDb();
    const newOrder = {
      id: `ZARO-${Math.floor(10000 + Math.random() * 90000)}`,
      userEmail: userEmail || 'guest@zaro.dev',
      projectName,
      category: category || 'Custom Web Concept',
      price: Number(price),
      date: new Date().toISOString().split('T')[0],
      estDelivery: estDelivery || 'Immediate Delivery',
      status: 'launched'
    };

    db.orders = db.orders || [];
    db.orders.unshift(newOrder);
    writeDb(db);

    return res.status(201).json({ success: true, message: 'Order created successfully', data: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
