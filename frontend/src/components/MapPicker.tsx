import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLng, LeafletMouseEvent } from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { reverseGeocode } from '../api/utils';

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
  onLocationSelect: (coords: [number, number], address: string) => void;
  className?: string;
};

export function MapPicker({ initialPosition, onLocationSelect, className = "" }: MapPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(
    initialPosition ? new LatLng(initialPosition[0], initialPosition[1]) : null
  );
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  const markerRef = useRef(null);

  useEffect(() => {
    if (initialPosition) {
      setPosition(new LatLng(initialPosition[0], initialPosition[1]));
    } 
  }, [initialPosition]);

  const handleInteraction = async (latlng: LatLng) => {
    setIsGeocoding(true);
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
        
        {position && (
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          >
            <Popup>Arraste para ajustar</Popup>
          </Marker>
        )}
        
        <MapEventsHandler onMapClick={handleInteraction} />
      </MapContainer>
    </div>
  );
}