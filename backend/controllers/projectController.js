import { readDb, writeDb } from '../data/dbHelper.js';

export const getProjects = (req, res) => {
  try {
    const { email, role } = req.query;
    const db = readDb();
    let projects = db.projects || [];

    if (email) {
      if (role === 'freelancer') {
        projects = projects.filter(p => p.freelancerEmail?.toLowerCase() === email.toLowerCase());
      } else if (role === 'client') {
        projects = projects.filter(p => p.clientEmail?.toLowerCase() === email.toLowerCase());
      } else {
        projects = projects.filter(p => 
          p.clientEmail?.toLowerCase() === email.toLowerCase() || 
          p.freelancerEmail?.toLowerCase() === email.toLowerCase()
        );
      }
    }

    return res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const getProjectById = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const project = db.projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const createProject = (req, res) => {
  try {
    const { title, clientName, clientEmail, freelancerName, freelancerEmail, category, budget, deadline, description } = req.body;
    if (!title || !budget) {
      return res.status(400).json({ success: false, message: 'Title and budget are required.' });
    }

    const db = readDb();
    const newProject = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      clientName: clientName || 'Anonymous Client',
      clientEmail: clientEmail || '',
      freelancerName: freelancerName || 'Unassigned',
      freelancerEmail: freelancerEmail || '',
      category: category || 'Web Development',
      budget: Number(budget),
      paid: 0,
      status: 'In Progress',
      progress: 10,
      deadline: deadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      description: description || '',
      milestones: [
        { name: 'Project Kickoff & Spec Alignment', amount: Math.round(Number(budget) * 0.3), status: 'In Progress' }
      ]
    };

    db.projects.unshift(newProject);
    writeDb(db);

    return res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

export const updateProjectStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress } = req.body;

    const db = readDb();
    const index = db.projects.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (status !== undefined) db.projects[index].status = status;
    if (progress !== undefined) db.projects[index].progress = Number(progress);

    writeDb(db);
    return res.status(200).json({ success: true, message: 'Project updated', data: db.projects[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
