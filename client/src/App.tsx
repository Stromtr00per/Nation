import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkspacePage from './pages/WorkspacePage';
import PageEditor from './pages/PageEditor';
import './App.css';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: {
    id: string;
    userId: string;
    role: 'OWNER' | 'MEMBER';
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  pages: any[];
}

export interface Page {
  id: string;
  title: string;
  contentId: string;
  workspaceId: string;
  children: Page[];
  blocks: any[];
}

let token: string | null = null;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const { workspaceId, pageId } = useParams();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      token = storedToken;
    }
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchWorkspaces(parsedUser.email);
    }
  }, []);

  const fetchWorkspaces = async (email: string) => {
    try {
      const response = await fetch('/api/workspaces', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      fetchWorkspaces(email);
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error };
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();
    if (response.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      fetchWorkspaces(email);
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setWorkspaces([]);
  };

  const createWorkspace = async (name: string) => {
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspaces(prev => [data, ...prev]);
        return { success: true };
      }
      return { success: false, error: 'Failed to create workspace' };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Get current workspace
  const currentWorkspace = workspaces.find(w => w.id === workspaceId);

  // Fetch page data
  const [page, setPage] = useState<Page | null>(null);
  const [fetchingPage, setFetchingPage] = useState(false);

  useEffect(() => {
    if (workspaceId && pageId && token) {
      fetchPage();
    }
  }, [workspaceId, pageId, token]);

  const fetchPage = async () => {
    if (!workspaceId || !pageId) return;
    
    try {
      setFetchingPage(true);
      const response = await fetch(`/api/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPage(data);
      } else {
        // Redirect to workspace list if page not found
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      navigate('/');
    } finally {
      setFetchingPage(false);
    }
  };

  // Save page
  const savePage = async (pageData: Partial<Page>) => {
    try {
      let response;
      if (pageId) {
        response = await fetch(`/api/pages/${pageId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pageData)
        });
      } else {
        response = await fetch('/api/pages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...pageData, workspaceId })
        });
      }

      if (response.ok) {
        await fetchWorkspaces(user?.email || '');
        if (pageId) {
          fetchPage();
        }
      } else {
        throw new Error('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  // Delete page
  const deletePage = async (pageIdToDelete: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/pages/${pageIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchWorkspaces(user?.email || '');
        navigate('/');
      } else {
        throw new Error('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login onLogin={login} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register onRegister={register} />} 
        />
        <Route 
          path="/" 
          element={
            <div className="workspace-container">
              <header className="app-header">
                <h1>Notion Clone</h1>
                <div className="user-menu">
                  <span>{user?.name || user?.email}</span>
                  <button onClick={logout}>Logout</button>
                  <button onClick={() => createWorkspace('New Workspace')}>
                    + New Workspace
                  </button>
                </div>
              </header>
              <WorkspacePage workspaces={workspaces} />
            </div>
          } 
        />
        <Route 
          path="/workspaces/:workspaceId" 
          element={<WorkspacePage workspaces={workspaces} />} 
        />
        <Route 
          path="/workspaces/:workspaceId/pages/:pageId" 
          element={
            <PageEditor 
              workspaceId={workspaceId!}
              pageId={pageId}
              page={page}
              onSave={savePage}
              onDelete={deletePage}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
