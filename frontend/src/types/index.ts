export interface VenueProposal {
  venueName: string;
  location: string;
  estimatedCost: string;
  whyItFits: string;
  capacity: string | null;
  amenities: string[];
  venueType: string | null;
}

export interface ParsedIntent {
  attendees: string | null;
  duration: string | null;
  budget: string | null;
  eventType: string | null;
  preferences: string[];
}

export interface EventSearch {
  _id: string;
  userQuery: string;
  parsedIntent: ParsedIntent;
  proposal: VenueProposal;
  alternativeVenues: VenueProposal[];
  aiModel: string;
  processingTimeMs: number;
  status: 'success' | 'error';
  createdAt: string;
  updatedAt: string;
  formattedDate: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
  errors?: Array<{ field: string; message: string }>;
}
