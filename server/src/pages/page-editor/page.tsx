import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../lib/api';
import { PageEditor } from './page-editor';

export const Page = () => {
  const { workspaceId, pageId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch page data
  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', { workspaceId, pageId }],
    queryFn: async () => {
      const res = await fetch(`${getApiUrl()}/pages/${pageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch page');
      return res.json();
    },
    enabled: !!workspaceId && !!pageId
  });

  // Create page mutation
  const createPage = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${getApiUrl()}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create page');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    }
  });

  // Update page mutation
  const updatePage = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${getApiUrl()}/pages/${data.pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update page');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', { workspaceId, pageId }] });
    }
  });

  // Delete page mutation
  const deletePage = useMutation({
    mutationFn: async (pageId: string) => {
      const res = await fetch(`${getApiUrl()}/pages/${pageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete page');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      navigate(`/workspaces/${workspaceId}`);
    }
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading page</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageEditor
        page={page}
        workspaceId={workspaceId}
        pageId={pageId}
        onCreatePage={createPage.mutate}
        onUpdatePage={updatePage.mutate}
        onDeletePage={deletePage.mutate}
      />
    </div>
  );
};
