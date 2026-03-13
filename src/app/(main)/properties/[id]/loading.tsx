import { Container } from '@/components/layout';

export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-6">
          {/* Breadcrumb skeleton */}
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image gallery skeleton */}
              <div className="aspect-[16/10] bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-20 h-16 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>

              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>

              {/* Features skeleton */}
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div>
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
