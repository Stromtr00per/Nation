import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createPage = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { title, workspaceId, contentId } = req.body;

    if (!title || !workspaceId) {
      return res.status(400).json({ error: 'Title and workspaceId are required' });
    }

    const page = await prisma.page.create({
      data: {
        title,
        workspaceId,
        contentId: contentId || crypto.randomUUID()
      }
    });

    res.status(201).json(page);
  } catch (error: any) {
    console.error('Create page error:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
};

export const getPages = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { workspaceId } = req.query;

    const pages = await prisma.page.findMany({
      where: workspaceId ? { workspaceId: workspaceId as string } : { workspaceId: req.user!.id },
      include: {
        workspace: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        blocks: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(pages);
  } catch (error: any) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

export const getPage = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        blocks: true
      }
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const hasAccess = page.workspace.ownerId === req.user!.id;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(page);
  } catch (error: any) {
    console.error('Get page error:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

export const updatePage = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, blocks, contentId } = req.body;

    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (page.workspace.ownerId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await prisma.page.update({
      where: { id },
      data: { 
        title,
        contentId
      }
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update page error:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
};

export const deletePage = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;

    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (page.workspace.ownerId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.block.deleteMany({
      where: { contentId: page.contentId }
    });

    await prisma.page.delete({ where: { id } });

    res.json({ message: 'Page deleted successfully' });
  } catch (error: any) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
};
