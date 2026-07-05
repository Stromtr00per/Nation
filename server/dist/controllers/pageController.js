"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.updatePage = exports.getPage = exports.getPages = exports.createPage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPage = async (req, res) => {
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
    }
    catch (error) {
        console.error('Create page error:', error);
        res.status(500).json({ error: 'Failed to create page' });
    }
};
exports.createPage = createPage;
const getPages = async (req, res) => {
    try {
        const { workspaceId } = req.query;
        const pages = await prisma.page.findMany({
            where: workspaceId ? { workspaceId: workspaceId } : { workspaceId: req.user.id },
            include: {
                workspace: {
                    include: {
                        members: {
                            include: {
                                user: { select: { id: true, name: true, email: true } }
                            }
                        }
                    }
                },
                children: true,
                blocks: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(pages);
    }
    catch (error) {
        console.error('Get pages error:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
};
exports.getPages = getPages;
const getPage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await prisma.page.findUnique({
            where: { id },
            include: {
                workspace: {
                    include: {
                        members: {
                            include: {
                                user: { select: { id: true, name: true, email: true } }
                            }
                        }
                    }
                },
                children: true,
                blocks: true
            }
        });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        // Check if user has access
        const hasAccess = page.workspace.members.some(member => member.userId === req.user.id);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(page);
    }
    catch (error) {
        console.error('Get page error:', error);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
};
exports.getPage = getPage;
const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, blocks, contentId } = req.body;
        const page = await prisma.page.findUnique({
            where: { id }
        });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        if (page.workspace.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const updated = await prisma.page.update({
            where: { id },
            data: {
                title,
                ...(blocks && { contentId: blocks[0]?.id || crypto.randomUUID() }),
                ...(contentId && { contentId })
            }
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Update page error:', error);
        res.status(500).json({ error: 'Failed to update page' });
    }
};
exports.updatePage = updatePage;
const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await prisma.page.findUnique({
            where: { id }
        });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        if (page.workspace.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }
        // Delete associated blocks
        await prisma.block.deleteMany({
            where: { contentId: page.contentId }
        });
        await prisma.page.delete({ where: { id } });
        res.json({ message: 'Page deleted successfully' });
    }
    catch (error) {
        console.error('Delete page error:', error);
        res.status(500).json({ error: 'Failed to delete page' });
    }
};
exports.deletePage = deletePage;
//# sourceMappingURL=pageController.js.map