const STORAGE_KEY = 'bharatbhoomi_property_views';

export interface PropertyView {
  propertyId: string;
  timestamp: string;
  userId?: number;
  userPhone?: string;
  userName?: string;
}

export interface ViewStats {
  totalViews: number;
  uniqueUsers: number;
  mostViewed: { propertyId: string; count: number }[];
  recentViews: PropertyView[];
}

function getViews(): PropertyView[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveViews(views: PropertyView[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
}

export function trackPropertyView(
  propertyId: string,
  user?: { id?: number; phone?: string | null; name?: string | null }
) {
  const views = getViews();
  views.push({
    propertyId,
    timestamp: new Date().toISOString(),
    userId: user?.id,
    userPhone: user?.phone || undefined,
    userName: user?.name || undefined,
  });
  saveViews(views);
}

export function getStats(): ViewStats {
  const views = getViews();

  const uniqueUsers = new Set(
    views.map((v) => v.userId || v.userPhone || 'anon')
  ).size;

  // Most viewed
  const viewCounts: Record<string, number> = {};
  for (const v of views) {
    viewCounts[v.propertyId] = (viewCounts[v.propertyId] || 0) + 1;
  }

  const mostViewed = Object.entries(viewCounts)
    .map(([propertyId, count]) => ({ propertyId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalViews: views.length,
    uniqueUsers,
    mostViewed,
    recentViews: views.slice(-20).reverse(),
  };
}
