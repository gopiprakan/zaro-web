import { readDb, writeDb } from '../data/dbHelper.js';

export const submitInquiry = (req, res) => {
  try {
    const { name, email, phone, service, budget, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const db = readDb();
    const newInquiry = {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone: phone || '',
      service: service || 'Custom Development',
      budget: budget || 'Not Specified',
      message: message || '',
      submittedAt: new Date().toISOString(),
      status: 'New'
    };

    db.inquiries = db.inquiries || [];
    db.inquiries.unshift(newInquiry);
    writeDb(db);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received. Our design strategist will connect shortly.',
      data: newInquiry
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getInquiries = (req, res) => {
  try {
    const db = readDb();
    return res.status(200).json({ success: true, count: (db.inquiries || []).length, data: db.inquiries || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
