import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { LatLng, Icon, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrige ícone padrão
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configura ícone do Leaflet
const DefaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Aplica globalmente
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

export default function MapDisplay({ 
  center, 
  zoom = 13, 
  markers = [], 
  route,
  className = "h-full w-full"
}: MapDisplayProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  const routePath = useMemo(() => {
    if (!route?.path) return [];
    return route.path.map(p => new LatLng(p[0], p[1]));
  }, [route]);

  // Efeito para ajustar o mapa aos marcadores ou rota
  useEffect(() => {
    if (!mapRef.current) return;

    const bounds = new L.LatLngBounds([]);

    // Adiciona marcadores aos limites
    markers.forEach(m => bounds.extend(m.position));

    // Adiciona rota aos limites
    if (routePath.length > 0) {
      routePath.forEach(p => bounds.extend(p));
    }

    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      mapRef.current.setView(center, zoom);
    } else {
      // Fallback padrão se nada for fornecido (ex: São Paulo)
      mapRef.current.setView([-23.5505, -46.6333], zoom);
    }
  }, [markers, routePath, center, zoom]);

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-inner ${className}`}>
      <MapContainer 
        center={center || [-23.5505, -46.6333]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
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
