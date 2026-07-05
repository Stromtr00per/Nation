import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './PageEditor.css';

interface Page {
  id: string;
  title: string;
  contentId: string;
  workspaceId: string;
  children: Page[];
  blocks: Array<{
    id: string;
    type: string;
    content: string;
    text?: string;
    parentId?: string;
  }>;
}

interface PageEditorProps {
  workspaceId: string;
  pageId?: string;
  page?: Page;
  onSave: (page: Partial<Page>) => Promise<void>;
  onDelete: (pageId: string) => Promise<void>;
}

export const PageEditor = ({ workspaceId, pageId, page, onSave, onDelete }: PageEditorProps) => {
  const [title, setTitle] = useState(page?.title || '');
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockContent, setBlockContent] = useState('');
  const { addEdge } = useReactFlow();
  const navigate = useNavigate();

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setBlockContent(page.blocks[0]?.content || '');
      
      // Set nodes from page blocks
      if (page.blocks) {
        const nodeIdMap = new Map();
        page.blocks.forEach((block, index) => {
          const nodeId = `block-${index}`;
          nodeIdMap.set(nodeId, block);
        });

        const newNodes = Array.from(nodeIdMap.entries()).map(([id, block]) => ({
          id,
          type: 'default',
          position: { x: 100, y: index * 150 },
          data: {
            label: (
              <div className="block-node">
                <div className="block-content">
                  {block.type === 'text' && <p>{block.content}</p>}
                  {block.type === 'heading_1' && <h1>{block.content}</h1>}
                  {block.type === 'heading_2' && <h2>{block.content}</h2>}
                  {block.type === 'heading_3' && <h3>{block.content}</h3>}
                  {block.type === 'bulleted_list' && <ul>{block.content.split('\n').map((line: string, i: number) => <li key={i}>{line}</li>)}</ul>}
                  {block.type === 'numbered_list' && <ol>{block.content.split('\n').map((line: string, i: number) => <li key={i}>{line}</li>)}</ol>}
                  {block.type === 'todo' && <div className="todo-item">
                    <input type="checkbox" /> {block.content}
                  </div>}
                  {block.type === 'image' && <img src={block.content} alt="Block content" />}
                  {block.type === 'code' && <pre>{block.content}</pre>}
                </div>
              </div>
            ),
            onNodeClick: (event: any, node: any) => {
              event.stopPropagation();
              setSelectedBlockId(node.id);
              setBlockContent(node.data.label.textContent || '');
            }
          }
        }));

        setNodes(newNodes);

        // Set edges between blocks
        const newEdges = Array.from(nodeIdMap.keys()).map((nodeId, index) => {
          if (index === 0) return null;
          return {
            id: `${nodeIdMap.keys()[index - 1]}->${nodeId}`,
            source: nodeIdMap.keys()[index - 1],
            target: nodeId,
            type: 'default',
            animated: false
          };
        }).filter(Boolean);

        setEdges(newEdges);
      }
    }
  }, [page]);

  const handleAddBlock = () => {
    const newBlockId = `block-${nodes.length}`;
    const newBlock = {
      id: newBlockId,
      type: 'text',
      content: ''
    };

    const newNodes = [...nodes];
    newNodes.push({
      id: newBlockId,
      type: 'default',
      position: { x: 100, y: (nodes.length * 150) + 50 },
      data: {
        label: (
          <div className="block-node">
            <div className="block-content">
              <p>{newBlock.content}</p>
            </div>
          </div>
        ),
        onNodeClick: (event: any, node: any) => {
          event.stopPropagation();
          setSelectedBlockId(node.id);
          setBlockContent(node.data.label.textContent || '');
        }
      }
    });

    setNodes(newNodes);

    // Add edge from last block to new block
    if (nodes.length > 0) {
      const lastNodeId = nodes[nodes.length - 1].id;
      addEdge({
        id: `${lastNodeId}->${newBlockId}`,
        source: lastNodeId,
        target: newBlockId,
        type: 'default',
        animated: false
      });
    }

    setSelectedBlockId(newBlockId);
    setBlockContent('');
  };

  const handleDeleteBlock = () => {
    if (!selectedBlockId) return;

    const newNodes = nodes.filter(node => node.id !== selectedBlockId);
    setNodes(newNodes);

    const newEdges = edges.filter(edge => 
      edge.source !== selectedBlockId && edge.target !== selectedBlockId
    );
    setEdges(newEdges);

    setSelectedBlockId(null);
    setBlockContent('');
  };

  const handleContentChange = (newContent: string) => {
    setBlockContent(newContent);

    // Update the block in nodes
    setNodes(nodes.map(node => 
      node.id === selectedBlockId
        ? { ...node, data: { ...node.data, label: <div className="block-node"><div className="block-content"><p>{newContent}</p></div></div> } }
        : node
    ));
  };

  const handleSave = async () => {
    await onSave({
      title,
      ...(pageId && { id: pageId }),
      ...(page?.blocks && {
        blocks: nodes.map(node => ({
          id: node.id,
          type: 'text',
          content: node.data.label.textContent || ''
        }))
      })
    });
  };

  return (
    <ReactFlowProvider>
      <div className="page-editor-container">
        <div className="editor-header">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="page-title"
            placeholder="Page title"
          />
        </div>

        <div className="editor-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(newNodes) => setNodes(newNodes)}
            onEdgesChange={(newEdges) => setEdges(newEdges)}
            onInit={(handle) => {
              setNodes(handle.getNodes());
              setEdges(handle.getEdges());
            }}
            fitView
          />
        </div>

        <div className="editor-footer">
          <div className="block-toolbar">
            <button onClick={handleAddBlock} className="btn-add-block">
              + Add Block
            </button>
            <button onClick={handleDeleteBlock} className="btn-delete-block" disabled={!selectedBlockId}>
              Delete Block
            </button>
          </div>

          <div className="block-content-editor">
            <textarea
              value={blockContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="block-textarea"
              placeholder="Enter block content..."
            />
          </div>

          <div className="editor-actions">
            <button onClick={handleSave} className="btn-save">
              Save Page
            </button>
            <button onClick={() => onDelete(pageId!)} className="btn-delete">
              Delete Page
            </button>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default PageEditor;
