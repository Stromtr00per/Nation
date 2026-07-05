"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@xyflow/react");
require("@xyflow/react/dist/style.css");
const PageEditor = ({ page, workspaceId, pageId, onCreatePage, onUpdatePage, onDeletePage }) => {
    const nodes = (0, react_1.useRef)([]);
    const edges = (0, react_1.useRef)([]);
    const { addEdge } = (0, react_2.useReactFlow)();
    const [title, setTitle] = (0, react_1.useState)(page?.title || '');
    const [content, setContent] = (0, react_1.useState)(page?.blocks?.[0]?.content || '');
    const [selectedBlockId, setSelectedBlockId] = (0, react_1.useState)(pageId || '');
    // Update title when page changes
    (0, react_1.useEffect)(() => {
        setTitle(page?.title || '');
    }, [page]);
    // Handle block creation
    const handleAddBlock = () => {
        const newBlockId = crypto.randomUUID();
        const block = {
            id: newBlockId,
            type: 'text',
            content: ''
        };
        // Add edge from selected block to new block
        if (selectedBlockId) {
            addEdge({
                id: `${selectedBlockId}->${newBlockId}`,
                source: selectedBlockId,
                target: newBlockId,
                type: 'default',
                animated: false
            });
        }
        nodes.current.push({
            id: newBlockId,
            type: 'default',
            position: { x: 100, y: -150 },
            data: {
                label: block,
                onNodeClick: (e, node) => {
                    e.stopPropagation();
                    setSelectedBlockId(node.id);
                }
            }
        });
    };
    // Handle block deletion
    const handleDeleteBlock = () => {
        // Remove edges connected to selected block
        edges.current = edges.current.filter(edge => edge.source !== selectedBlockId && edge.target !== selectedBlockId);
        // Remove block node
        nodes.current = nodes.current.filter(node => node.id !== selectedBlockId);
        // Update state
        setSelectedBlockId('');
    };
    // Handle content change
    const handleContentChange = (newContent) => {
        setContent(newContent);
        // Update page in backend
        if (pageId) {
            onUpdatePage({
                pageId,
                blocks: [{ ...page?.blocks?.[0], content: newContent }]
            });
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-100 p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full text-3xl font-bold p-4 mb-4 border-2 border-transparent focus:border-blue-500 outline-none", placeholder: "Page title" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(ReactFlow, { nodes: nodes.current, edges: edges.current, onNodesChange: (nodes) => {
                                nodes.current = nodes;
                            }, onEdgesChange: (edges) => {
                                edges.current = edges;
                            }, onInit: (handle) => {
                                nodes.current = handle.getNodes();
                                edges.current = handle.getEdges();
                            }, fitView: true }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-8 left-1/2 transform -translate-x-1/2 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-lg shadow-lg", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleAddBlock, className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "+ Add Block" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleDeleteBlock, className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2", children: "Delete Block" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-lg shadow-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-2", children: "Block Content" }), (0, jsx_runtime_1.jsx)("textarea", { value: content, onChange: (e) => handleContentChange(e.target.value), className: "w-full h-32 p-2 border rounded focus:border-blue-500 outline-none", placeholder: "Enter block content..." })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-8 flex justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => onCreatePage({ workspaceId, title }), className: "px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600", children: "Save Page" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onDeletePage(pageId), className: "px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600", children: "Delete Page" })] })] }) }));
};
exports.PageEditor = PageEditor;
//# sourceMappingURL=page-editor.js.map