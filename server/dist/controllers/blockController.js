"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveBlock = exports.deleteBlock = exports.updateBlock = exports.getBlock = exports.getBlocks = exports.createBlock = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBlock = async (req, res) => {
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
    }
    catch (error) {
        console.error('Create block error:', error);
        res.status(500).json({ error: 'Failed to create block' });
    }
};
exports.createBlock = createBlock;
const getBlocks = async (req, res) => {
    try {
        const { contentId } = req.query;
        const blocks = await prisma.block.findMany({
            where: contentId ? { contentId: contentId } : { contentId: req.user.id },
            include: {
                children: true,
                parent: true
            }
        });
        res.json(blocks);
    }
    catch (error) {
        console.error('Get blocks error:', error);
        res.status(500).json({ error: 'Failed to fetch blocks' });
    }
};
exports.getBlocks = getBlocks;
const getBlock = async (req, res) => {
    try {
        const { id } = req.params;
        const block = await prisma.block.findUnique({
            where: { id },
            include: {
                children: true,
                parent: true
            }
        });
        if (!block) {
            return res.status(404).json({ error: 'Block not found' });
        }
        res.json(block);
    }
    catch (error) {
        console.error('Get block error:', error);
        res.status(500).json({ error: 'Failed to fetch block' });
    }
};
exports.getBlock = getBlock;
const updateBlock = async (req, res) => {
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
    }
    catch (error) {
        console.error('Update block error:', error);
        res.status(500).json({ error: 'Failed to update block' });
    }
};
exports.updateBlock = updateBlock;
const deleteBlock = async (req, res) => {
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
    }
    catch (error) {
        console.error('Delete block error:', error);
        res.status(500).json({ error: 'Failed to delete block' });
    }
};
exports.deleteBlock = deleteBlock;
const moveBlock = async (req, res) => {
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
    }
    catch (error) {
        console.error('Move block error:', error);
        res.status(500).json({ error: 'Failed to move block' });
    }
};
exports.moveBlock = moveBlock;
//# sourceMappingURL=blockController.js.map