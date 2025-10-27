export interface Species {
  id: string; // Unique code
  name: string;
  scientificName: string;
  family: string;
  order: string;
  description: string;
  habitat: string;
  location: string;
  pointNumber: string;
  captureDate: string;
  fishingGear: string;
  imageUrl: string;
}

export interface Collection {
  id: string;
  name: string;
  ownerId: string; // User ID of the creator
  imageUrl: string;
  species: Species[];
  authorizedUsers: string[];
}

export interface AppData {
  collections: Record<string, Collection>;
  currentUser: string | null;
}