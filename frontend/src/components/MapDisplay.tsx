import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L, { LatLng, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default icon properly using the Leaflet instance
const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Apply to L.Marker.prototype.options.icon instead of the React Component
L.Marker.prototype.options.icon = DefaultIcon;

type MapDisplayProps = {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string | number;
    position: [number, number];
    title?: string;
    description?: string;
  }>;
  route?: {
    path: [number, number][];
    color?: string;
  };
  className?: string;
};

function MapController({ center, zoom }: { center?: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapDisplay({ 
  center = [-23.5505, -46.6333], // Default SP
  zoom = 13, 
  markers = [], 
  route,
  className = "h-full w-full"
}: MapDisplayProps) {

  const routePath = useMemo(() => {
    if (!route?.path) return [];
    return route.path.map(p => new LatLng(p[0], p[1]));
  }, [route]);

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-inner ${className}`}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={center} zoom={zoom} />

        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            {(marker.title || marker.description) && (
              <Popup>
                <div className="font-sans">
                  {marker.title && <h3 className="font-bold text-sm">{marker.title}</h3>}
                  {marker.description && <p className="text-xs text-gray-600">{marker.description}</p>}
                </div>
              </Popup>
            )}
          </Marker>
        ))}

        {routePath.length > 0 && (
          <Polyline 
            positions={routePath} 
            color={route?.color || "#3b82f6"} 
            weight={5} 
            opacity={0.8} 
          />
        )}
      </MapContainer>
    </div>
  );
}
