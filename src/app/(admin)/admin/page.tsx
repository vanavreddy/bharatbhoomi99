'use client';

import { useState, useEffect } from 'react';
import { useBuilders } from '@/contexts';
import { adminService } from '@/lib/api/services/admin.service';
import { Card } from '@/components/ui';
import type { AdminAnalytics } from '@/types';
import {
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Heart,
  Mail,
  CalendarDays,
  Home,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { activeBuilders } = useBuilders();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getAnalytics()
      .then(setAnalytics)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { label: 'Total Properties', value: analytics?.totalProperties ?? '-', icon: Home, color: 'bg-blue-500' },
    { label: 'Pending', value: analytics?.pendingProperties ?? '-', icon: Building2, color: 'bg-amber-500' },
    { label: 'Approved', value: analytics?.approvedProperties ?? '-', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Rejected', value: analytics?.rejectedProperties ?? '-', icon: XCircle, color: 'bg-red-500' },
    { label: 'Property Views', value: analytics?.totalPropertyViews ?? '-', icon: Eye, color: 'bg-purple-500' },
    { label: 'Enquiries', value: analytics?.totalEnquiries ?? '-', icon: MessageCircle, color: 'bg-indigo-500' },
    { label: 'Favorites', value: analytics?.totalFavorites ?? '-', icon: Heart, color: 'bg-rose-500' },
    { label: 'Contact Forms', value: analytics?.totalContactSubmissions ?? '-', icon: Mail, color: 'bg-cyan-500' },
    { label: 'Home Tours', value: analytics?.totalHomeTourRequests ?? '-', icon: CalendarDays, color: 'bg-teal-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time analytics from the backend</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} padding="lg">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoading ? (
                    <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Active Builders */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Active Builders ({activeBuilders.length})
        </h2>
        <div className="space-y-3">
          {activeBuilders.slice(0, 5).map((builder) => (
            <div key={builder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${builder.color} flex items-center justify-center`}>
                  <span className="text-xs font-bold text-white">{builder.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{builder.name}</p>
                  <p className="text-xs text-gray-500">{builder.projectCount}+ projects</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Active</span>
            </div>
          ))}
          {activeBuilders.length > 5 && (
            <p className="text-sm text-gray-500 text-center pt-2">+{activeBuilders.length - 5} more</p>
          )}
          {activeBuilders.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active builders</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
