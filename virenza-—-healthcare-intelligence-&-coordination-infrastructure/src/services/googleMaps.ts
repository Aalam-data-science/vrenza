import { Loader } from '@googlemaps/js-api-loader';

export const GOOGLE_MAPS_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY) ||
  'AIzaSyATKQ2VVOoTjYmyaeiHzDeY920xxsen078';

export const mapsLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry'],
});

export interface MapLocation {
  id: string;
  name: string;
  category: 'HOSPITAL' | 'TRAUMA_CENTER' | 'AMBULANCE' | 'CLINIC' | 'PHARMACY';
  lat: number;
  lng: number;
  address: string;
  status: string;
  capacity?: string;
  etaMinutes?: number;
}

export const SEED_MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'fac-1',
    name: 'St. Jude Metropolitan Trauma Center (Level I)',
    category: 'TRAUMA_CENTER',
    lat: 37.7749,
    lng: -122.4194,
    address: '1001 Potrero Ave, San Francisco, CA',
    status: 'Operational • 4 ICU Beds Open',
    capacity: '88% Occupancy',
  },
  {
    id: 'fac-2',
    name: 'UCSF Medical Health Hub & Oncology Center',
    category: 'HOSPITAL',
    lat: 37.7631,
    lng: -122.4583,
    address: '505 Parnassus Ave, San Francisco, CA',
    status: 'Operational • Advanced Cath Lab Active',
    capacity: '92% Occupancy',
  },
  {
    id: 'fac-3',
    name: 'Sutter Health Mission Bay Emergency Clinic',
    category: 'CLINIC',
    lat: 37.7699,
    lng: -122.3923,
    address: '1825 4th St, San Francisco, CA',
    status: 'Walk-in Triage Ready • 12m wait',
    capacity: 'Normal',
  },
  {
    id: 'amb-1',
    name: 'Rapid Response Unit Delta-4 (ALS)',
    category: 'AMBULANCE',
    lat: 37.7812,
    lng: -122.4112,
    address: 'Market & 6th St (In-Transit)',
    status: 'En-Route to Code-3 Beacon',
    etaMinutes: 4,
  },
  {
    id: 'amb-2',
    name: 'Critical Care Transport Sky-1',
    category: 'AMBULANCE',
    lat: 37.7550,
    lng: -122.4300,
    address: 'Twin Peaks Corridor',
    status: 'Stationed / Available',
    etaMinutes: 8,
  },
  {
    id: 'ph-1',
    name: 'Walgreens 24/7 Specialty Infusion Pharmacy',
    category: 'PHARMACY',
    lat: 37.7885,
    lng: -122.4072,
    address: '135 Powell St, San Francisco, CA',
    status: 'Open 24 Hours • Emergency Antidotes Stocked',
  },
];
