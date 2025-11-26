import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  MessageSquare, 
  Shield, 
  Navigation, 
  Crosshair, 
  Menu, 
  X, 
  Package, 
  AlertTriangle,
  MapPin,
  Clock,
  Lock
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getFrete, updateOrderStatus, OrderStatus } from "../api/fretes";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import RateDriverModal from "../components/RateDriverModal";
import SlideButton from "../components/SlideButton";
import TrackingBottomSheet from "../components/TrackingBottomSheet";

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

type OrderDetail = {
  _id: string;
  status: OrderStatus;
  origin: { address: string; coords?: [number, number] };
  destination: { address: string; coords?: [number, number] };
  transporterId?: {
    userId: {
      _id: string;
      name: string;
      phone?: string;
      avatarUrl?: string;
    };
    vehicle?: { model: string; plate: string };
    rating?: number;
  };
  clientId: string;
  client?: {
     name: string;
     avatarUrl?: string;
     rating?: number;
     phone?: string;
  };
  price: number;
  distanceKm: number;
  description?: string;
  items?: any[];
  confirmationCode?: string; // Only visible to client
};

// Component to handle map centering
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, viewMode } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  
  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]);
  const [mapZoom, setMapZoom] = useState(15);

  useEffect(() => {
    if (id) {
      loadOrder();
      const interval = setInterval(loadOrder, 5000);
      return () => clearInterval(interval);
    } else {
      findActiveOrder();
    }
  }, [id]);

  function findActiveOrder() {
    import("../api/fretes").then(({ listFretes }) => {
      listFretes(1, 20).then((res) => {
        // Find first active order
        const active = res.data.find((o: any) => 
          ['accepted', 'arrived_pickup', 'in_route'].includes(o.status)
        );
        
        if (active) {
          navigate(`/rastreio/${active._id}`, { replace: true });
        } else {
          setLoading(false);
          setError("Você não tem nenhuma corrida em andamento no momento.");
        }
      }).catch(() => {
        setLoading(false);
        setError("Erro ao buscar corridas ativas.");
      });
    });
  }

  function loadOrder() {
    if (!id) return;
    getFrete(id)
      .then((data) => {
        setOrder(data);
        if (!order && data.origin.coords) {
           setMapCenter(data.origin.coords);
        }
      })
      .catch((err) => {
        console.error("Failed to load order", err);
        setError("Não foi possível carregar os detalhes do pedido.");
      })
      .finally(() => setLoading(false));
  }

  async function handleStatusUpdate(newStatus: OrderStatus, code?: string) {
    if (!id || !order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus, code);
      await loadOrder(); 
      if (newStatus === 'delivered') {
        setShowPinModal(false);
        setShowRatingModal(true); // Prompt rating after delivery
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Erro ao atualizar status. Verifique o PIN se necessário.");
    } finally {
      setUpdating(false);
    }
  }

  const handleOpenNavigation = () => {
    if (!order) return;

    // Logic for navigation target based on status
    if (order.status === 'accepted' && order.origin.coords && order.destination.coords) {
      // Pickup phase: Navigate to Pickup
      const [pickupLat, pickupLng] = order.origin.coords;
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pickupLat},${pickupLng}&travelmode=driving`;
      window.open(mapsUrl, '_blank');
      return;
    }

    if ((order.status === 'arrived_pickup' || order.status === 'in_route') && order.destination.coords) {
      // Delivery phase: Navigate to Destination
      const [destLat, destLng] = order.destination.coords;
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
      window.open(mapsUrl, '_blank');
      return;
    }
  };

  const handleRecenter = () => {
    if (!order) return;
    // Recenter based on current objective
    if (order.status === 'accepted' && order.origin.coords) {
      setMapCenter(order.origin.coords);
    } else if (order.destination.coords) {
      setMapCenter(order.destination.coords);
    }
    setMapZoom(16);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900"><Spinner /></div>;
  
  if (error || !order) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center space-y-4">
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
        <Package className="w-8 h-8 text-gray-500" />
      </div>
      <h2 className="text-xl font-bold">{error || "Pedido não encontrado"}</h2>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-colors"
      >
        Voltar ao Início
      </button>
    </div>
  );

  // Determine role based on viewMode (if set) or user role
  const isDriver = viewMode === 'driver' || (!viewMode && user?.role === 'driver');
  const isClient = viewMode === 'client' || (!viewMode && user?.role === 'client');
  
  const originCoords = order.origin.coords || [-23.5505, -46.6333];
  const destCoords = order.destination.coords || [-23.561, -46.655];

  // --- STATE MACHINE LOGIC ---
  let instruction = "Aguardando...";
  let subInstruction = "";
  let targetAddress = "";
  let sliderAction = null;
  let statusColor = "text-blue-500";

  if (order.status === 'accepted') {
    instruction = "Vá para a Coleta";
    subInstruction = "Dirija-se ao ponto de retirada";
    targetAddress = order.origin.address;
    statusColor = "text-blue-500";
    if (isDriver) {
      sliderAction = {
        text: "Cheguei na Coleta",
        action: () => handleStatusUpdate('arrived_pickup'),
        color: "blue"
      };
    }
  } else if (order.status === 'arrived_pickup') {
    instruction = "Aguardando Carga";
    subInstruction = "Confira os itens e inicie a viagem";
    targetAddress = order.origin.address;
    statusColor = "text-orange-500";
    if (isDriver) {
      sliderAction = {
        text: "Iniciar Corrida",
        action: () => handleStatusUpdate('in_route'),
        color: "blue"
      };
    }
  } else if (order.status === 'in_route') {
    instruction = "Em Trânsito";
    subInstruction = "Leve a encomenda ao destino";
    targetAddress = order.destination.address;
    statusColor = "text-purple-500";
    if (isDriver) {
      sliderAction = {
        text: "Cheguei no Destino", // Or "Finalizar" directly if we skip 'arrived_dest'
        action: () => setShowPinModal(true), // Open PIN modal instead of direct update
        color: "green"
      };
    }
  } else if (order.status === 'delivered') {
    instruction = "Entregue";
    subInstruction = "Corrida finalizada com sucesso";
    targetAddress = order.destination.address;
    statusColor = "text-green-500";
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 overflow-hidden relative">
      
      {/* 1. MAPA */}
      <div className="flex-grow relative z-0">
        <MapContainer 
          center={originCoords} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <Marker position={originCoords}>
            <Popup>Coleta: {order.origin.address}</Popup>
          </Marker>
          <Marker position={destCoords}>
            <Popup>Destino: {order.destination.address}</Popup>
          </Marker>
          
          {/* Route Line */}
          {['accepted', 'arrived_pickup', 'in_route'].includes(order.status) && (
             <Polyline positions={[originCoords, destCoords]} color="#3b82f6" weight={5} opacity={0.8} />
          )}
        </MapContainer>

        {/* Floating Map Buttons */}
        <div className="absolute right-4 top-4 flex flex-col gap-3 z-[400]">
          <button 
            onClick={handleOpenNavigation}
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-500 transition-colors"
          >
            <Navigation className="w-6 h-6" />
          </button>
          <button 
            onClick={handleRecenter}
            className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <Crosshair className="w-6 h-6" />
          </button>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 w-10 h-10 bg-gray-800/80 backdrop-blur text-white rounded-full flex items-center justify-center shadow-lg z-[400] hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>


      </div>

      {/* 2. BOTTOM SHEET (Conditional) */}
      {isClient ? (
        <TrackingBottomSheet 
          order={order} 
          onCancel={() => handleStatusUpdate('cancelled')} 
        />
      ) : (
        /* DRIVER MISSION CONTROL PANEL */
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10 flex flex-col max-h-[85vh]"
        >
          {/* Handle Bar */}
          <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>

          <div className="px-6 pb-8 pt-2 space-y-5 overflow-y-auto">
            
            {/* Line 1: Stats & Cancel */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~15 min</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{order.distanceKm.toFixed(1)} km</span>
              </div>
              {isDriver && order.status !== 'delivered' && (
                 <button onClick={() => handleStatusUpdate('cancelled')} className="text-red-500 hover:text-red-600 font-medium text-xs uppercase tracking-wide">
                   Cancelar
                 </button>
              )}
            </div>

            {/* Line 2: Context / Address */}
            <div>
              <div className="flex items-start gap-3">
                <MapPin className={`w-6 h-6 mt-1 flex-shrink-0 ${statusColor}`} />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {targetAddress || "Carregando..."}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{subInstruction}</p>
                </div>
              </div>
            </div>

            {/* Line 3: Client/Driver Info */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold">
                  {/* Avatar logic */}
                  {(isDriver ? order.client?.name : order.transporterId?.userId.name)?.[0] || "U"}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">{isDriver ? "Cliente" : "Motorista"}</p>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {isDriver ? (order.client?.name || "Cliente") : (order.transporterId?.userId.name || "Motorista")}
                  </h3>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 text-green-600 shadow-sm flex items-center justify-center hover:bg-green-50 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 text-blue-600 shadow-sm flex items-center justify-center hover:bg-blue-50 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Line 4: Main Action Slider */}
            {isDriver && sliderAction && (
              <div className="pt-2">
                <SlideButton 
                  onConfirm={sliderAction.action}
                  text={sliderAction.text}
                  color={sliderAction.color}
                  resetKey={order.status}
                />
              </div>
            )}
             
             {/* Client View Status (Legacy fallback if needed, but covered by BottomSheet now) */}
             {!isDriver && !isClient && order.status !== 'delivered' && (
               <div className="w-full py-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-center font-bold text-gray-500 animate-pulse">
                 {instruction}
               </div>
             )}
          </div>
        </motion.div>
      )}

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Código de Segurança</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Peça o código de 4 dígitos ao cliente para finalizar a entrega.
              </p>
              
              <input 
                type="text" 
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-4xl font-bold tracking-[1em] py-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0000"
              />

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleStatusUpdate('delivered', pinInput)}
                  disabled={pinInput.length !== 4 || updating}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {updating ? <Spinner size="sm" /> : "Confirmar"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <RateDriverModal 
        isOpen={showRatingModal} 
        onClose={() => {
          setShowRatingModal(false);
          navigate('/');
        }}
        driverName={order.transporterId?.userId.name || "Motorista"}
        driverAvatar={order.transporterId?.userId.avatarUrl}
        orderId={id || ""}
      />
    </div>
  );
}
