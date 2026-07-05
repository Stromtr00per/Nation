import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function WorkspacePage({ workspaces }: { workspaces: any[] }) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loadingPages, setLoadingPages] = useState(false);
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newWorkspaceName })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedWorkspace(data);
        setNewWorkspaceName('');
        setShowCreate(false);
        fetchPages(data.id);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create workspace');
      }
    } catch (err) {
      setError('Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async (workspaceId: string) => {
    try {
      setLoadingPages(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pages?workspaceId=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (err) {
      console.error('Error fetching pages:', err);
    } finally {
      setLoadingPages(false);
    }
  };

  const handleSelectPage = async (page: any) => {
    setSelectedPage(page);
    navigate(`/workspaces/${workspaceId}/pages/${page.id}`);
  };

  const handleCreatePage = async () => {
    if (!selectedWorkspace) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          workspaceId: selectedWorkspace.id,
          title: 'Untitled Page'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPages([data, ...pages]);
        setSelectedPage(data);
        navigate(`/workspaces/${selectedWorkspace.id}/pages/${data.id}`);
      } else {
        throw new Error('Failed to create page');
      }
    } catch (err) {
      console.error('Error creating page:', err);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPages(pages.filter(p => p.id !== pageId));
        if (selectedPage?.id === pageId) {
          setSelectedPage(null);
        }
      } else {
        throw new Error('Failed to delete page');
      }
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '2rem',
      height: 'calc(100vh - 80px)',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Workspaces</h2>
        
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setShowCreate(!showCreate)}
            style={{
              flex: 1,
              padding: '0.5rem',
              background: '#0079bf',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showCreate ? 'Cancel' : '+ New'}
          </button>
        </div>

        {showCreate && (
          <div style={{ marginBottom: '1rem' }}>
            {error && (
              <div style={{
                background: '#fee',
                color: '#c00',
                padding: '0.5rem',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}>
                {error}
              </div>
            )}
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}
            />
            <button
              onClick={handleCreateWorkspace}
              disabled={loading || !newWorkspaceName.trim()}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#0079bf',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => {
                setSelectedWorkspace(workspace);
                navigate(`/workspaces/${workspace.id}`);
                fetchPages(workspace.id);
              }}
              style={{
                flex: 1,
                minWidth: '100px',
                padding: '0.5rem',
                background: selectedWorkspace?.id === workspace.id ? '#0079bf' : '#f0f0f0',
                color: selectedWorkspace?.id === workspace.id ? 'white' : '#333',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              {workspace.name}
            </div>
          ))}
        </div>
      </div>

      {/* Pages Sidebar */}
      {selectedWorkspace && (
        <div style={{
          width: '280px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Pages</h3>
          <button
            onClick={handleCreatePage}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#0079bf',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            + New Page
          </button>

          <div style={{
            flex: 1,
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '4px'
          }}>
            {loadingPages ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : pages.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                No pages yet
              </div>
            ) : (
              pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => handleSelectPage(page)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ flex: 1 }}>{page.title || 'Untitled'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(page.id);
                    }}
                    style={{
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem',
        overflow: 'hidden'
      }}>
        {selectedPage ? (
          <div>
            <button
              onClick={() => setSelectedPage(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ← Back to workspace
            </button>
            <div style={{ minHeight: '100vh' }}>
              <p>Loading page editor...</p>
            </div>
          </div>
        ) : selectedWorkspace ? (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h1 style={{ fontSize: '1.5rem' }}>{selectedWorkspace.name}</h1>
              <button onClick={handleCreatePage}>
                + New Page
              </button>
            </div>

            <div style={{
              border: '2px dashed #e0e0e0',
              borderRadius: '8px',
              padding: '3rem',
              textAlign: 'center',
              color: '#666'
            }}>
              <h2 style={{ marginBottom: '1rem' }}>Welcome to {selectedWorkspace.name}</h2>
              <p style={{ marginBottom: '1rem' }}>Start creating your first page</p>
              <button
                onClick={handleCreatePage}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0079bf',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Page
              </button>
            </div>
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#666'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Select a Workspace</h2>
            <p>Choose a workspace from the sidebar to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
