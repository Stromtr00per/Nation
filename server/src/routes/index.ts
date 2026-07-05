import express from 'express';
import * as userController from '../controllers/userController';
import * as workspaceController from '../controllers/workspaceController';
import * as pageController from '../controllers/pageController';
import * as blockController from '../controllers/blockController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(verifyToken);

// User routes
router.get('/profile', userController.getProfile);

// Workspace routes
router.get('/workspaces', workspaceController.getWorkspaces);
router.get('/workspaces/:id', workspaceController.getWorkspace);
router.post('/workspaces', workspaceController.createWorkspace);
router.put('/workspaces/:id', workspaceController.updateWorkspace);
router.delete('/workspaces/:id', workspaceController.deleteWorkspace);

// Page routes
router.get('/pages', pageController.getPages);
router.post('/pages', pageController.createPage);
router.get('/pages/:id', pageController.getPage);
router.put('/pages/:id', pageController.updatePage);
router.delete('/pages/:id', pageController.deletePage);

// Block routes
router.get('/blocks', blockController.getBlocks);
router.post('/blocks', blockController.createBlock);
router.get('/blocks/:id', blockController.getBlock);
router.put('/blocks/:id', blockController.updateBlock);
router.delete('/blocks/:id', blockController.deleteBlock);
router.put('/blocks/:id/move', blockController.moveBlock);

export default router;
