import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getWorkspaces = async (req: AuthRequest & Request, res: Response) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { ownerId: req.user!.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(workspaces);
  } catch (error: any) {
    console.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
};

export const getWorkspace = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const hasAccess = workspace.ownerId === req.user!.id;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(workspace);
  } catch (error: any) {
    console.error('Get workspace error:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
};

export const createWorkspace = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        ownerId: req.user!.id
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(workspace);
  } catch (error: any) {
    console.error('Create workspace error:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};

export const updateWorkspace = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where: { id }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    if (workspace.ownerId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await prisma.workspace.update({
      where: { id },
      data: { name }
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update workspace error:', error);
    res.status(500).json({ error: 'Failed to update workspace' });
  }
};

export const deleteWorkspace = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;

    const workspace = await prisma.workspace.findUnique({
      where: { id }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    if (workspace.ownerId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete associated pages and blocks
    await prisma.page.deleteMany({
      where: { workspaceId: id }
    });

    await prisma.workspace.delete({ where: { id } });

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error: any) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
};
