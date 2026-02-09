'use client';

import { useState } from 'react';
import { useBuilders } from '@/contexts';
import { Button, Card, Input } from '@/components/ui';
import type { Builder } from '@/types/builder.types';
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Building2,
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
  'bg-blue-600',
  'bg-red-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-amber-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-rose-600',
  'bg-cyan-600',
  'bg-orange-600',
];

interface BuilderFormData {
  name: string;
  shortDescription: string;
  description: string;
  logo: string;
  projectCount: string;
  established: string;
  headquarters: string;
}

const emptyForm: BuilderFormData = {
  name: '',
  shortDescription: '',
  description: '',
  logo: '',
  projectCount: '',
  established: '',
  headquarters: 'Bangalore',
};

export default function AdminBuildersPage() {
  const { allBuilders, addBuilder, updateBuilder, deleteBuilder, toggleBuilderActive } = useBuilders();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BuilderFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (builder: Builder) => {
    setEditingId(builder.id);
    setForm({
      name: builder.name,
      shortDescription: builder.shortDescription,
      description: builder.description,
      logo: builder.logo,
      projectCount: String(builder.projectCount),
      established: String(builder.established),
      headquarters: builder.headquarters,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const existing = allBuilders.find((b) => b.id === editingId);
      if (!existing) return;
      updateBuilder({
        ...existing,
        name: form.name,
        slug: generateSlug(form.name),
        initials: generateInitials(form.name),
        shortDescription: form.shortDescription,
        description: form.description,
        logo: form.logo || existing.logo,
        projectCount: parseInt(form.projectCount) || 0,
        established: parseInt(form.established) || 2020,
        headquarters: form.headquarters,
      });
    } else {
      const newBuilder: Builder = {
        id: `builder-${Date.now()}`,
        name: form.name,
        slug: generateSlug(form.name),
        initials: generateInitials(form.name),
        color: COLORS[allBuilders.length % COLORS.length] || 'bg-blue-600',
        logo: form.logo || '/images/builders/default.png',
        shortDescription: form.shortDescription,
        description: form.description,
        projectCount: parseInt(form.projectCount) || 0,
        established: parseInt(form.established) || 2020,
        headquarters: form.headquarters,
        isActive: true,
      };
      addBuilder(newBuilder);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    deleteBuilder(id);
    setDeleteConfirm(null);
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
          <p className="text-gray-500 mt-1">
            {allBuilders.length} builders total
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Builder
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card padding="lg" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Builder' : 'Add New Builder'}
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Builder Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Prestige Group"
                required
              />
              <Input
                label="Headquarters"
                value={form.headquarters}
                onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
                placeholder="e.g. Bangalore"
                required
              />
              <Input
                label="Project Count"
                type="number"
                value={form.projectCount}
                onChange={(e) => setForm({ ...form, projectCount: e.target.value })}
                placeholder="e.g. 100"
              />
              <Input
                label="Established Year"
                type="number"
                value={form.established}
                onChange={(e) => setForm({ ...form, established: e.target.value })}
                placeholder="e.g. 1990"
              />
              <Input
                label="Logo URL"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                placeholder="/images/builders/name.png"
              />
              <Input
                label="Short Description"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="One-line description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed description of the builder..."
                rows={3}
                className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all resize-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">
                {editingId ? 'Update Builder' : 'Add Builder'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Builders Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">
                  Builder
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">
                  Projects
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">
                  Est.
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">
                  HQ
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBuilders.map((builder) => (
                <tr key={builder.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${builder.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xs font-bold text-white">{builder.initials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{builder.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{builder.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {builder.projectCount}+
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {builder.established}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {builder.headquarters}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => toggleBuilderActive(builder.id)}
                      className="flex items-center gap-1.5"
                    >
                      {builder.isActive ? (
                        <>
                          <ToggleRight className="h-6 w-6 text-green-500" />
                          <span className="text-xs font-medium text-green-700">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(builder)}
                        className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {deleteConfirm === builder.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(builder.id)}
                            className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(builder.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {allBuilders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No builders yet. Add your first builder above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
