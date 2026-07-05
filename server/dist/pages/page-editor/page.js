"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_query_1 = require("@tanstack/react-query");
const react_router_dom_1 = require("react-router-dom");
const api_1 = require("../../lib/api");
const page_editor_1 = require("./page-editor");
const Page = () => {
    const { workspaceId, pageId } = (0, react_router_dom_1.useParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const queryClient = (0, react_query_1.useQueryClient)();
    // Fetch page data
    const { data: page, isLoading, error } = (0, react_query_1.useQuery)({
        queryKey: ['page', { workspaceId, pageId }],
        queryFn: async () => {
            const res = await fetch(`${(0, api_1.getApiUrl)()}/pages/${pageId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok)
                throw new Error('Failed to fetch page');
            return res.json();
        },
        enabled: !!workspaceId && !!pageId
    });
    // Create page mutation
    const createPage = (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            const res = await fetch(`${(0, api_1.getApiUrl)()}/pages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok)
                throw new Error('Failed to create page');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
        }
    });
    // Update page mutation
    const updatePage = (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            const res = await fetch(`${(0, api_1.getApiUrl)()}/pages/${data.pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok)
                throw new Error('Failed to update page');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            queryClient.invalidateQueries({ queryKey: ['page', { workspaceId, pageId }] });
        }
    });
    // Delete page mutation
    const deletePage = (0, react_query_1.useMutation)({
        mutationFn: async (pageId) => {
            const res = await fetch(`${(0, api_1.getApiUrl)()}/pages/${pageId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok)
                throw new Error('Failed to delete page');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages'] });
            navigate(`/workspaces/${workspaceId}`);
        }
    });
    if (isLoading)
        return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Loading..." });
    if (error)
        return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-red-500", children: "Error loading page" });
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0, jsx_runtime_1.jsx)(page_editor_1.PageEditor, { page: page, workspaceId: workspaceId, pageId: pageId, onCreatePage: createPage.mutate, onUpdatePage: updatePage.mutate, onDeletePage: deletePage.mutate }) }));
};
exports.Page = Page;
//# sourceMappingURL=page.js.map