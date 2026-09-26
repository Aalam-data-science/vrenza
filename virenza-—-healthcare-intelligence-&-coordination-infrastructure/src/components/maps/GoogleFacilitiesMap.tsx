import React, { useEffect, useRef, useState } from 'react';
import { mapsLoader, SEED_MAP_LOCATIONS, MapLocation } from '../../services/googleMaps';
import { groundWithMaps } from '../../services/geminiClient';
import { MapPin, Navigation, Hospital, ShieldAlert, Sparkles, Search, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface Props {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

export const GoogleFacilitiesMap: React.FC<Props> = ({
  className = '',
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 13,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Maps Grounding Query State
  const [groundingQuery, setGroundingQuery] = useState('');
  const [isGrounding, setIsGrounding] = useState(false);
  const [groundingResult, setGroundingResult] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      try {
        await (mapsLoader as any).load();
        if (!isMounted) return;

        const g = (window as any).google;
        if (!g?.maps) {
          throw new Error('Google Maps script failed to initialize');
        }

        const map = new g.maps.Map(mapContainerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'administrative',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#444444' }],
            },
            {
              featureType: 'landscape',
              elementType: 'all',
              stylers: [{ color: '#f2f2f2' }],
            },
            {
              featureType: 'poi.medical',
              elementType: 'all',
              stylers: [{ visibility: 'on' }, { color: '#e8f5e9' }],
            },
            {
              featureType: 'road',
              elementType: 'all',
              stylers: [{ saturation: -100 }, { lightness: 45 }],
            },
            {
              featureType: 'water',
              elementType: 'all',
              stylers: [{ color: '#d4e4ec' }, { visibility: 'on' }],
            },
          ],
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Render markers
        renderMarkers(map, SEED_MAP_LOCATIONS);
      } catch (err: any) {
        console.error('Failed to load Google Maps:', err);
        if (isMounted) {
          setMapError(err?.message || 'Unable to connect to Google Maps JavaScript API.');
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, []);

  const renderMarkers = (
    map: any,
    locations: MapLocation[]
  ) => {
    const g = (window as any).google;
    if (!g) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    locations.forEach((loc) => {
      const markerColor =
        loc.category === 'TRAUMA_CENTER'
          ? '#B03A28'
          : loc.category === 'AMBULANCE'
          ? '#B86218'
          : loc.category === 'HOSPITAL'
          ? '#2C5530'
          : '#3C7049';

      const svgPin = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${markerColor}" stroke="#ffffff" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
        </svg>
      `;

      const marker = new g.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        title: loc.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgPin)}`,
          scaledSize: new g.maps.Size(32, 32),
        },
      });

      marker.addListener('click', () => {
        setSelectedLocation(loc);
        map.panTo({ lat: loc.lat, lng: loc.lng });
      });

      markersRef.current.push(marker);
    });
  };

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    if (!mapInstanceRef.current) return;

    const filtered =
      category === 'ALL'
        ? SEED_MAP_LOCATIONS
        : SEED_MAP_LOCATIONS.filter((l) => l.category === category);

    renderMarkers(mapInstanceRef.current, filtered);
  };

  const handleMapsGroundingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groundingQuery.trim()) return;

    setIsGrounding(true);
    setGroundingResult(null);
    try {
      const res = await groundWithMaps({
        prompt: `Locate healthcare facilities or medical services: ${groundingQuery}`,
      });
      setGroundingResult(res.text);
    } catch (err: any) {
      setGroundingResult(`Grounding query error: ${err.message}`);
    } finally {
      setIsGrounding(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#E7E4DC] shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAECE6] text-[#2C5530] flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#22241F]">Google Maps Fleet & Facility Radar</h4>
            <p className="text-[11px] text-[#7A7568]">Live GIS telemetry for trauma centers, triage clinics, and mobile units</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'All Units' },
            { id: 'TRAUMA_CENTER', label: 'Trauma Centers' },
            { id: 'HOSPITAL', label: 'Hospitals' },
            { id: 'AMBULANCE', label: 'Ambulances' },
            { id: 'CLINIC', label: 'Clinics' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#2C5530] text-white shadow-xs'
                  : 'bg-[#F4F2EE] text-[#5A564C] hover:bg-[#EAECE6]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative rounded-xl border border-[#E7E4DC] overflow-hidden bg-[#F2F2F2] min-h-[380px] shadow-inner">
        <div ref={mapContainerRef} className="w-full h-[380px]" />

        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F5F0]/80 backdrop-blur-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#2C5530]" />
            <span className="text-xs font-mono text-[#7A7568] mt-2">Connecting to Google Maps Platform...</span>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDF2F0] p-6 text-center">
            <ShieldAlert className="w-8 h-8 text-[#B03A28] mb-2" />
            <p className="text-xs font-semibold text-[#B03A28]">Google Maps Initialization Notice</p>
            <p className="text-[11px] text-[#7A7568] max-w-sm mt-1">{mapError}</p>
          </div>
        )}

        {/* Selected Facility Overlay Drawer */}
        {selectedLocation && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-[#E7E4DC] shadow-lg text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7568]">
                  {selectedLocation.category.replace('_', ' ')}
                </span>
                <h5 className="font-semibold text-[#22241F] text-sm leading-tight mt-0.5">
                  {selectedLocation.name}
                </h5>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-[#7A7568] hover:text-[#22241F] text-sm p-0.5"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-[#5A564C]">{selectedLocation.address}</p>

            <div className="p-2 bg-[#F4F2EE] rounded-lg text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#7A7568]">Telemetry Status:</span>
                <span className="font-semibold text-[#2C5530]">{selectedLocation.status}</span>
              </div>
              {selectedLocation.capacity && (
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7568]">Capacity:</span>
                  <span className="font-mono text-[#22241F]">{selectedLocation.capacity}</span>
                </div>
              )}
              {selectedLocation.etaMinutes && (
                <div className="flex items-center justify-between">
                  <span className="text-[#7A7568]">Estimated Transit:</span>
                  <span className="font-mono font-semibold text-[#B86218]">{selectedLocation.etaMinutes} mins</span>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setZoom(16);
                  mapInstanceRef.current.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng });
                }
              }}
              leftIcon={<Navigation className="w-3.5 h-3.5" />}
            >
              Dispatch Navigation Vectors
            </Button>
          </div>
        )}
      </div>

      {/* Gemini Maps Grounding Live Tool */}
      <Card variant="surface" padding="sm" className="space-y-2">
        <form onSubmit={handleMapsGroundingSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7568]" />
            <input
              type="text"
              value={groundingQuery}
              onChange={(e) => setGroundingQuery(e.target.value)}
              placeholder="Ground with Google Maps data (e.g., 'Level 1 trauma centers near Mission District with open cath labs')"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E7E4DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5530]"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            disabled={isGrounding || !groundingQuery.trim()}
            leftIcon={isGrounding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#3C7049]" />}
          >
            Maps Grounding
          </Button>
        </form>

        {groundingResult && (
          <div className="p-3 bg-[#F4F2EE] rounded-lg border border-[#E7E4DC] text-xs text-[#22241F] whitespace-pre-wrap leading-relaxed">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2C5530] mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Gemini 3.5 Flash Maps Grounded Intelligence:</span>
            </div>
            {groundingResult}
          </div>
        )}
      </Card>
    </div>
  );
};
