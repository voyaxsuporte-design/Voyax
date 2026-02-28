export enum View {
  Home = 'home',
  Chat = 'chat',
  Flights = 'flights',
  Hotels = 'hotels',
  Experiences = 'experiences',
  Checkout = 'checkout',
  MyTrips = 'my-trips',
  Financial = 'financial',
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  dates: string;
  status: 'confirmed' | 'planning' | 'draft';
  image: string;
  hotel?: string;
  cabin?: string;
  price?: string;
}

export interface Experience {
  id: string;
  name: string;
  duration: string;
  price: number;
  image: string;
  rating: number;
  recommended?: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  rating: number;
  recommended?: boolean;
  description?: string;
  amenities?: string[];
  propertyType?: string;
  guestRating?: number;
  mealPlan?: string;
  freeCancellation?: boolean;
  distanceCenter?: number;
}

export interface Flight {
  id: string;
  airline: string;
  number: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: number;
  recommended?: boolean;
  cabin?: string;
}
