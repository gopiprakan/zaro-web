import express from 'express';
import { getProjects, getProjectById, createProject, updateProjectStatus } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.patch('/:id/status', updateProjectStatus);

export default router;
