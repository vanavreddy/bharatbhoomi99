'use client';

import { useBuilders } from '@/contexts';
import { Card } from '@/components/ui';
import {
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  Users,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { allBuilders, activeBuilders } = useBuilders();

  // Get stats from localStorage
  const getViewStats = () => {
    try {
      const stored = localStorage.getItem('bharatbhoomi_property_views');
      if (stored) {
        const views = JSON.parse(stored);
        const uniqueUsers = new Set(views.map((v: { userId?: number }) => v.userId || 'anon')).size;
        return { totalViews: views.length, uniqueUsers };
      }
    } catch {
      // ignore
    }
    return { totalViews: 0, uniqueUsers: 0 };
  };

  const { totalViews, uniqueUsers } = getViewStats();

  const stats = [
    {
      label: 'Total Builders',
      value: allBuilders.length,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Builders',
      value: activeBuilders.length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Property Views',
      value: totalViews,
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      label: 'Unique Visitors',
      value: uniqueUsers,
      icon: Users,
      color: 'bg-amber-500',
    },
  ];

  const inactiveBuilders = allBuilders.filter((b) => !b.isActive);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} padding="lg">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Builders Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Builders */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Active Builders ({activeBuilders.length})
          </h2>
          <div className="space-y-3">
            {activeBuilders.slice(0, 5).map((builder) => (
              <div
                key={builder.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${builder.color} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{builder.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{builder.name}</p>
                    <p className="text-xs text-gray-500">{builder.projectCount}+ projects</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Active
                </span>
              </div>
            ))}
            {activeBuilders.length > 5 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                +{activeBuilders.length - 5} more builders
              </p>
            )}
          </div>
        </Card>

        {/* Inactive Builders */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Inactive Builders ({inactiveBuilders.length})
          </h2>
          {inactiveBuilders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">All builders are active</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inactiveBuilders.map((builder) => (
                <div
                  key={builder.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${builder.color} flex items-center justify-center opacity-50`}>
                      <span className="text-xs font-bold text-white">{builder.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{builder.name}</p>
                      <p className="text-xs text-gray-500">{builder.projectCount}+ projects</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                    Inactive
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
