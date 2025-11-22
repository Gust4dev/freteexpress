import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import { LatLng, LeafletMouseEvent, Icon } from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { reverseGeocode, fetchRoutePath } from '../api/utils';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// --- Custom Icons ---
const createCustomIcon = (color: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(
      ReactDOMServer.renderToString(
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={color} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" fill="white" />
        </svg>
      )
    )}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const pickupIcon = createCustomIcon('#9333ea'); // Purple
const dropoffIcon = createCustomIcon('#2563eb'); // Blue

// --- Hook Isolation Pattern ---
type MapEventsHandlerProps = {
  onMapClick: (latlng: LatLng) => void;
};

function MapEventsHandler({ onMapClick }: MapEventsHandlerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// --- Main Component Props ---
type MapPickerProps = {
  initialPosition?: [number, number];
  originCoords?: [number, number];
  destCoords?: [number, number];
  onLocationSelect: (coords: [number, number], address: string) => void;
  className?: string;
  mode?: 'pickup' | 'dropoff'; // New prop to know which marker to update
};

export function MapPicker({ initialPosition, originCoords, destCoords, onLocationSelect, className = "", mode = 'pickup' }: MapPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(
    initialPosition ? new LatLng(initialPosition[0], initialPosition[1]) : null
  );
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [routePath, setRoutePath] = useState<LatLng[]>([]);
  
  const markerRef = useRef(null);

  useEffect(() => {
    if (initialPosition) {
      setPosition(new LatLng(initialPosition[0], initialPosition[1]));
    } 
  }, [initialPosition]);

  useEffect(() => {
    if (originCoords && destCoords) {
      fetchRoutePath(originCoords, destCoords)
        .then((data) => {
          if (data.geometry && data.geometry.coordinates) {
            // OSRM returns [lon, lat], Leaflet needs [lat, lon]
            const positions = data.geometry.coordinates.map((c: number[]) => new LatLng(c[1], c[0]));
            setRoutePath(positions);
          }
        })
        .catch((err) => {
          console.error("Route fetch error", err);
          setRoutePath([]);
        });
    } else {
      setRoutePath([]);
    }
  }, [originCoords, destCoords]);

  const handleInteraction = async (latlng: LatLng) => {
    setIsGeocoding(true);
    // Update local position state only if it matches the current mode's target
    // But actually, onLocationSelect updates the parent state, which passes back originCoords/destCoords
    // So we might not need local position state as much, but let's keep it for immediate feedback
    setPosition(latlng);

    try {
      const response = await reverseGeocode([latlng.lat, latlng.lng]);
      const address = response.address || response.fullAddress;
      onLocationSelect([latlng.lat, latlng.lng], address);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latlng = (marker as any).getLatLng();
          handleInteraction(latlng);
        }
      },
    }),
    [] 
  );

  return (
    <div className={`relative overflow-hidden shadow-lg border border-gray-200 ${className || "h-[400px] w-full rounded-xl"}`}>
      {/* Loading Indicator */}
      <AnimatePresence>
        {isGeocoding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Buscando endereço...
          </motion.div>
        )}
      </AnimatePresence>
      
      <MapContainer 
        center={initialPosition || [-16.328, -48.953]} // Default: Anápolis
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {routePath.length > 0 && (
          <Polyline positions={routePath} color="blue" weight={5} opacity={0.7} />
        )}

        {/* Origin Marker (Purple) */}
        {originCoords && (
          <Marker
            position={originCoords}
            icon={pickupIcon}
            draggable={mode === 'pickup'}
            eventHandlers={mode === 'pickup' ? eventHandlers : undefined}
            ref={mode === 'pickup' ? markerRef : undefined}
            zIndexOffset={100}
          >
            <Popup>Ponto de Coleta</Popup>
          </Marker>
        )}

        {/* Destination Marker (Blue) */}
        {destCoords && (
          <Marker
            position={destCoords}
            icon={dropoffIcon}
            draggable={mode === 'dropoff'}
            eventHandlers={mode === 'dropoff' ? eventHandlers : undefined}
            ref={mode === 'dropoff' ? markerRef : undefined}
            zIndexOffset={100}
          >
            <Popup>Destino Final</Popup>
          </Marker>
        )}
        
        <MapEventsHandler onMapClick={handleInteraction} />
      </MapContainer>
    </div>
  );
}