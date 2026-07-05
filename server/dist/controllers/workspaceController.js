"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMember = exports.inviteMember = exports.deleteWorkspace = exports.updateWorkspace = exports.getWorkspace = exports.getWorkspaces = exports.createWorkspace = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Workspace name is required' });
        }
        const workspace = await prisma.workspace.create({
            data: { name, ownerId: req.user.id }
        });
        // Add user as owner to workspace
        await prisma.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                userId: req.user.id,
                role: 'OWNER'
            }
        });
        res.status(201).json(workspace);
    }
    catch (error) {
        console.error('Create workspace error:', error);
        res.status(500).json({ error: 'Failed to create workspace' });
    }
};
exports.createWorkspace = createWorkspace;
const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: { ownerId: req.user.id },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            }
        });
        res.json(workspaces);
    }
    catch (error) {
        console.error('Get workspaces error:', error);
        res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
};
exports.getWorkspaces = getWorkspaces;
const getWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const workspace = await prisma.workspace.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            }
        });
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }
        // Check if user has access
        const hasAccess = workspace.members.some(member => member.userId === req.user.id);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(workspace);
    }
    catch (error) {
        console.error('Get workspace error:', error);
        res.status(500).json({ error: 'Failed to fetch workspace' });
    }
};
exports.getWorkspace = getWorkspace;
const updateWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const workspace = await prisma.workspace.findUnique({
            where: { id }
        });
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }
        if (workspace.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Only workspace owner can update' });
        }
        const updated = await prisma.workspace.update({
            where: { id },
            data: { name }
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Update workspace error:', error);
        res.status(500).json({ error: 'Failed to update workspace' });
    }
};
exports.updateWorkspace = updateWorkspace;
const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const workspace = await prisma.workspace.findUnique({
            where: { id }
        });
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }
        if (workspace.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Only workspace owner can delete' });
        }
        await prisma.workspace.delete({ where: { id } });
        res.json({ message: 'Workspace deleted successfully' });
    }
    catch (error) {
        console.error('Delete workspace error:', error);
        res.status(500).json({ error: 'Failed to delete workspace' });
    }
};
exports.deleteWorkspace = deleteWorkspace;
const inviteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const workspace = await prisma.workspace.findUnique({
            where: { id }
        });
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }
        if (workspace.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Only workspace owner can invite members' });
        }
        const existingMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: id,
                userId: email
            }
        });
        if (existingMember) {
            return res.status(400).json({ error: 'User already a member' });
        }
        await prisma.workspaceMember.create({
            data: {
                workspaceId: id,
                userId: email,
                role: 'MEMBER'
            }
        });
        res.status(201).json({ message: 'Invitation sent' });
    }
    catch (error) {
        console.error('Invite member error:', error);
        res.status(500).json({ error: 'Failed to invite member' });
    }
};
exports.inviteMember = inviteMember;
const removeMember = async (req, res) => {
    try {
        const { workspaceId, userId } = req.params;
        const workspace = await prisma.workspace.findUnique({
            where: { workspaceId }
        });
        if (!workspace) {
            return res.status(404).json({ error: 'Workspace not found' });
        }
        if (workspace.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'Only workspace owner can remove members' });
        }
        await prisma.workspaceMember.delete({
            where: { workspaceId }
        });
        res.json({ message: 'Member removed successfully' });
    }
    catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ error: 'Failed to remove member' });
    }
};
exports.removeMember = removeMember;
//# sourceMappingURL=workspaceController.js.map