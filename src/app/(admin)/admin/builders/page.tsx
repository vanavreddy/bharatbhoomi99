'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Input } from '@/components/ui';
import type { Builder } from '@/types/builder.types';
import { builderService } from '@/lib/api/services/builder.service';
import { useToast } from '@/contexts';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Building2,
  RefreshCw,
} from 'lucide-react';

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const COLORS = [
  'bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-purple-600', 'bg-amber-600',
  'bg-teal-600', 'bg-indigo-600', 'bg-rose-600', 'bg-cyan-600', 'bg-orange-600',
];

interface BuilderFormData {
  name: string;
  description: string;
  projectCount: string;
  established: string;
  headquarters: string;
}

const emptyForm: BuilderFormData = {
  name: '',
  description: '',
  projectCount: '',
  established: '',
  headquarters: 'Bangalore',
};

export default function AdminBuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BuilderFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBuilders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await builderService.getActiveBuilders();
      setBuilders(data);
    } catch {
      setError('Failed to load builders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBuilders(); }, [fetchBuilders]);

  const handleEdit = (builder: Builder) => {
    setEditingId(builder.id);
    setForm({
      name: builder.name,
      description: builder.description,
      projectCount: String(builder.projectCount),
      established: String(builder.established),
      headquarters: builder.headquarters,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingId) {
        await fetch(`/api/admin/builders/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            initials: generateInitials(form.name),
            color: COLORS[builders.length % COLORS.length] || 'bg-blue-600',
            description: form.description || undefined,
            projectCount: parseInt(form.projectCount) || 0,
            established: form.established || undefined,
            headQuarters: form.headquarters || undefined,
          }),
        });
      } else {
        const builderId = `builder-${Date.now()}`;
        await fetch('/api/admin/builders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            builderId,
            name: form.name,
            slug: generateSlug(form.name),
            initials: generateInitials(form.name),
            color: COLORS[builders.length % COLORS.length] || 'bg-blue-600',
            description: form.description || undefined,
            projectCount: parseInt(form.projectCount) || 0,
            established: form.established || undefined,
            headQuarters: form.headquarters || undefined,
          }),
        });
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      showToast(editingId ? 'Builder updated' : 'Builder added');
      fetchBuilders();
    } catch {
      showToast('Failed to save builder', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/builders/${id}`, {
        method: 'DELETE',
      });
      setDeleteConfirm(null);
      showToast('Builder deleted');
      fetchBuilders();
    } catch {
      showToast('Failed to delete builder', 'error');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Builders</h1>
          <p className="text-gray-500 mt-1">{builders.length} builders total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBuilders} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          {!showForm && (
            <Button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Builder
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm && (
        <Card padding="lg" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Builder' : 'Add New Builder'}
            </h2>
            <button type="button" onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Builder Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Prestige Group" required />
              <Input label="Headquarters" value={form.headquarters} onChange={(e) => setForm({ ...form, headquarters: e.target.value })} placeholder="e.g. Bangalore" />
              <Input label="Project Count" type="number" value={form.projectCount} onChange={(e) => setForm({ ...form, projectCount: e.target.value })} placeholder="e.g. 100" />
              <Input label="Established Year" value={form.established} onChange={(e) => setForm({ ...form, established: e.target.value })} placeholder="e.g. 1990" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description of the builder..."
                rows={3}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all resize-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Builder' : 'Add Builder'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Builder</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Projects</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Est.</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">HQ</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : builders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No builders yet. Add your first builder above.</p>
                  </td>
                </tr>
              ) : (
                builders.map((builder) => (
                  <tr key={builder.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${builder.color} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-xs font-bold text-white">{builder.initials}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{builder.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{builder.projectCount}+</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{builder.established}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{builder.headquarters}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => handleEdit(builder)} className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        {deleteConfirm === builder.id ? (
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => handleDelete(builder.id)} className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600">Confirm</button>
                            <button type="button" onClick={() => setDeleteConfirm(null)} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setDeleteConfirm(builder.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
