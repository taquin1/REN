export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  image: string;
  distance: number;
  online: boolean;
  authMethod: "google" | "facebook" | "sms" | "email";
  verified: boolean;
}

export interface User {
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  image: string;
  authMethod: "google" | "facebook" | "sms" | "email";
  verified: boolean;
  location: { lat: number; lng: number; label: string };
}

export type View = "auth" | "verify" | "discover" | "matches" | "profile" | "video";