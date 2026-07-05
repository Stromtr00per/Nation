import { useEffect, useRef, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCreatePage, useUpdatePage, useDeletePage } from '../../hooks/usePages';
import { getApiUrl } from '../../lib/api';
import '@xyflow/react/dist/style.css';

export interface PageEditorProps {
  page?: any;
  workspaceId: string;
  pageId?: string;
  onCreatePage: any;
  onUpdatePage: any;
  onDeletePage: any;
}

export const PageEditor = ({ page, workspaceId, pageId, onCreatePage, onUpdatePage, onDeletePage }: PageEditorProps) => {
  const nodes = useRef<Node[]>([]);
  const edges = useRef<Edge[]>([]);
  const { addEdge } = useReactFlow();
  const [title, setTitle] = useState(page?.title || '');
  const [content, setContent] = useState(page?.blocks?.[0]?.content || '');
  const [selectedBlockId, setSelectedBlockId] = useState(pageId || '');

  // Update title when page changes
  useEffect(() => {
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
        onNodeClick: (e: any, node: any) => {
          e.stopPropagation();
          setSelectedBlockId(node.id);
        }
      }
    });
  };

  // Handle block deletion
  const handleDeleteBlock = () => {
    // Remove edges connected to selected block
    edges.current = edges.current.filter(edge => 
      edge.source !== selectedBlockId && edge.target !== selectedBlockId
    );
    
    // Remove block node
    nodes.current = nodes.current.filter(node => node.id !== selectedBlockId);
    
    // Update state
    setSelectedBlockId('');
  };

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    // Update page in backend
    if (pageId) {
      onUpdatePage({
        pageId,
        blocks: [{ ...page?.blocks?.[0], content: newContent }]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold p-4 mb-4 border-2 border-transparent focus:border-blue-500 outline-none"
          placeholder="Page title"
        />

        <div className="relative">
          <ReactFlow
            nodes={nodes.current}
            edges={edges.current}
            onNodesChange={(nodes) => {
              nodes.current = nodes;
            }}
            onEdgesChange={(edges) => {
              edges.current = edges;
            }}
            onInit={(handle) => {
              nodes.current = handle.getNodes();
              edges.current = handle.getEdges();
            }}
            fitView
          />

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <button
                onClick={handleAddBlock}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Block
              </button>
              <button
                onClick={handleDeleteBlock}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
              >
                Delete Block
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Block Content</h3>
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-32 p-2 border rounded focus:border-blue-500 outline-none"
                placeholder="Enter block content..."
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => onCreatePage({ workspaceId, title })}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save Page
          </button>
          <button
            onClick={() => onDeletePage(pageId)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Page
          </button>
        </div>
      </div>
    </div>
  );
};
