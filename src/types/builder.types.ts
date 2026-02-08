/**
 * Builder type definitions
 */

export interface Builder {
  id: string;
  name: string;
  slug: string;
  initials: string;
  color: string; // Tailwind color class for the badge (fallback)
  logo: string; // Path to logo image
  description: string;
  shortDescription: string;
  projectCount: number;
  established: number;
  headquarters: string;
}
