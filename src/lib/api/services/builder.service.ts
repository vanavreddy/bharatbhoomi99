/**
 * Builder Service — fetches builders via internal Next.js proxy
 * Called from client-side contexts, so uses relative URLs
 */

import { unwrapBBResponse } from '../bb-response';
import type { BBApiResponse, ExternalBBBuilder } from '../bb-types';
import type { Builder } from '@/types/builder.types';

function mapBuilder(ext: ExternalBBBuilder): Builder {
  return {
    id: ext.builderId,
    name: ext.name,
    slug: ext.slug,
    initials: ext.initials,
    color: ext.color,
    logo: '', // API builders don't have logo URLs; will fall back to initials
    description: ext.description || '',
    shortDescription: ext.description ? ext.description.substring(0, 120) : '',
    projectCount: ext.projectCount,
    established: ext.established ? parseInt(ext.established, 10) || 0 : 0,
    headquarters: ext.headQuarters || '',
    isActive: ext.isActive,
  };
}

export interface IBuilderService {
  getActiveBuilders(): Promise<Builder[]>;
  getBuilderBySlug(slug: string): Promise<Builder | null>;
}

class BuilderService implements IBuilderService {
  async getActiveBuilders(): Promise<Builder[]> {
    const res = await fetch('/api/builders', {
      headers: { 'Accept': 'application/json' },
    });
    const data: BBApiResponse<ExternalBBBuilder[]> = await res.json();
    const builders = unwrapBBResponse(data);
    return builders.filter((b) => b.isActive).map(mapBuilder);
  }

  async getBuilderBySlug(slug: string): Promise<Builder | null> {
    try {
      const res = await fetch(`/api/builders/${slug}`, {
        headers: { 'Accept': 'application/json' },
      });
      const data: BBApiResponse<ExternalBBBuilder> = await res.json();
      const builder = unwrapBBResponse(data);
      return builder ? mapBuilder(builder) : null;
    } catch {
      return null;
    }
  }
}

export const builderService = new BuilderService();
