import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createBlock = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { contentId, type, text, content, parentId } = req.body;

    if (!contentId || !type) {
      return res.status(400).json({ error: 'contentId and type are required' });
    }

    const block = await prisma.block.create({
      data: {
        contentId,
        type,
        text,
        content,
        parentId
      }
    });

    res.status(201).json(block);
  } catch (error: any) {
    console.error('Create block error:', error);
    res.status(500).json({ error: 'Failed to create block' });
  }
};

export const getBlocks = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { contentId } = req.query;

    const blocks = await prisma.block.findMany({
      where: contentId ? { contentId: contentId as string } : { contentId: req.user!.id },
    });

    res.json(blocks);
  } catch (error: any) {
    console.error('Get blocks error:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
};

export const getBlock = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;

    const block = await prisma.block.findUnique({
      where: { id }
    });

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    res.json(block);
  } catch (error: any) {
    console.error('Get block error:', error);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
};

export const updateBlock = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contentId, type, text, content, parentId } = req.body;

    const block = await prisma.block.findUnique({
      where: { id }
    });

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    const updated = await prisma.block.update({
      where: { id },
      data: {
        contentId,
        type,
        text,
        content,
        parentId
      }
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update block error:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
};

export const deleteBlock = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;

    const block = await prisma.block.findUnique({
      where: { id }
    });

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    await prisma.block.delete({ where: { id } });

    res.json({ message: 'Block deleted successfully' });
  } catch (error: any) {
    console.error('Delete block error:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
};

export const moveBlock = async (req: AuthRequest & Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contentId, parentId } = req.body;

    const block = await prisma.block.findUnique({
      where: { id }
    });

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    await prisma.block.update({
      where: { id },
      data: {
        contentId,
        parentId
      }
    });

    res.json({ message: 'Block moved successfully' });
  } catch (error: any) {
    console.error('Move block error:', error);
    res.status(500).json({ error: 'Failed to move block' });
  }
};
