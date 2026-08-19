'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, Users as UsersIcon, ShieldCheck, Home } from 'lucide-react';

interface AdminUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  propertyCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.apiErrors?.[0] ?? 'Could not load users');
        return;
      }
      setUsers(data.model?.data ?? []);
      setTotal(data.model?.pagination?.total ?? 0);
    } catch {
      setError('Could not load users');
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Debounced: typing in the search box should not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => { void fetchUsers(); }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchUsers, search]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">
            {isLoading ? 'Loading…' : `${total} registered user${total === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email"
          aria-label="Search users"
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
        />
      </div>

      {error && (
        <div role="alert" className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <UsersIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{search ? 'No users match that search.' : 'No users yet.'}</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Email</th>
                  <th scope="col" className="px-4 py-3 font-medium">Phone</th>
                  <th scope="col" className="px-4 py-3 font-medium">Listings</th>
                  <th scope="col" className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {u.firstName} {u.lastName ?? ''}
                        </span>
                        {u.isVerified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-semantic-success" aria-label="Verified" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.phone ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <Home className="h-3.5 w-3.5" />
                        {u.propertyCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
