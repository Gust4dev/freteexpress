import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, MessageSquare, Shield, CheckCircle, XCircle, Truck, Package, Star } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { getFrete, updateOrderStatus, OrderStatus } from "../api/fretes";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import RateDriverModal from "../components/RateDriverModal";

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
  price: number;
  distanceKm: number;
};

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    loadOrder();
  }, [id]);

  function loadOrder() {
    if (!id) return;
    getFrete(id)
      .then((data) => {
        setOrder(data);
        if (data.status === 'delivered' && user?.role === 'client' && data.clientId === user.id) {
           // Lógica para verificar se já avaliou
        }
      })
      .catch((err) => {
        console.error("Failed to load order", err);
        setError("Não foi possível carregar os detalhes do pedido.");
      })
      .finally(() => setLoading(false));
  }

  async function handleStatusUpdate(newStatus: OrderStatus) {
    if (!id || !order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      await loadOrder(); 
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Erro ao atualizar status.");
    } finally {
      setUpdating(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/rastreio/${searchId.trim()}`);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><Spinner /></div>;

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
            <Truck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Rastrear Pedido</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Digite o código do pedido para acompanhar a entrega em tempo real.</p>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              placeholder="Ex: 654321..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg font-mono tracking-wider text-gray-900 dark:text-white"
            />
            <button 
              type="submit"
              disabled={!searchId.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rastrear Agora
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error || !order) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Pedido não encontrado"}</div>;

  const isDriver = user?.role === 'driver' && order.transporterId?.userId._id === user.id;
  const isClient = user?.role === 'client' && order.clientId === user.id;

  const driverInfo = order.transporterId ? {
    name: order.transporterId.userId.name,
    vehicle: order.transporterId.vehicle ? `${order.transporterId.vehicle.model} - ${order.transporterId.vehicle.plate}` : "Veículo não informado",
    rating: order.transporterId.rating || 5.0,
    phone: order.transporterId.userId.phone || "Sem telefone",
    avatar: order.transporterId.userId.avatarUrl || `https://ui-avatars.com/api/?name=${order.transporterId.userId.name}&background=random`
  } : null;

  const originCoords = order.origin.coords || [-23.5505, -46.6333];
  const destCoords = order.destination.coords || [-23.561, -46.655];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Status e Detalhes */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Status do Pedido</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-bold animate-pulse ${
                order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {order.status === 'in_route' ? 'Em Trânsito' : 
                 order.status === 'created' ? 'Aguardando Motorista' :
                 order.status === 'accepted' ? 'Aceito' :
                 order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
              </span>
            </div>

            {/* Ações do Cliente: Avaliar Motorista */}
            {isClient && order.status === 'delivered' && (
              <div className="mb-6">
                <button 
                  onClick={() => setShowRatingModal(true)}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5 fill-current" /> Avaliar Motorista
                </button>
              </div>
            )}

            {/* Controles do Motorista */}
            {isDriver && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3">Ações do Motorista</h3>
                <div className="grid grid-cols-2 gap-3">
                  {order.status === 'accepted' && (
                    <button 
                      onClick={() => handleStatusUpdate('in_route')}
                      disabled={updating}
                      className="col-span-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Truck className="w-5 h-5" /> Iniciar Rota
                    </button>
                  )}
                  {order.status === 'in_route' && (
                    <button 
                      onClick={() => handleStatusUpdate('delivered')}
                      disabled={updating}
                      className="col-span-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" /> Confirmar Entrega
                    </button>
                  )}
                  <button 
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={updating}
                    className="col-span-2 py-2 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" /> Cancelar Corrida
                  </button>
                </div>
              </div>
            )}

            <div className="relative py-4">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              
              <div className="relative flex gap-4 mb-8">
                <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 z-10 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Origem</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{order.origin.address}</p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 z-10 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Destino</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{order.destination.address}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {!isDriver && driverInfo ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Motorista</h3>
              <div className="flex items-center gap-4 mb-6">
                <img src={driverInfo.avatar} alt={driverInfo.name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{driverInfo.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{driverInfo.vehicle}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                    <span>★</span> {driverInfo.rating}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <Phone className="w-4 h-4" /> Ligar
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <MessageSquare className="w-4 h-4" /> Chat
                </button>
              </div>
            </motion.div>
          ) : !isDriver && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center"
            >
              <p className="text-gray-500 dark:text-gray-400">Aguardando um motorista aceitar o pedido...</p>
            </motion.div>
          )}
        </div>

        {/* Coluna Direita: Mapa */}
        <div className="lg:col-span-2 h-[500px] lg:h-auto bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden relative shadow-inner z-0">
          <MapContainer 
            center={originCoords} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={originCoords}>
              <Popup>Coleta: {order.origin.address}</Popup>
            </Marker>
            <Marker position={destCoords}>
              <Popup>Destino: {order.destination.address}</Popup>
            </Marker>
            <Polyline positions={[originCoords, destCoords]} color="blue" />
          </MapContainer>
          
          {/* Informações Sobrepostas */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-[1000]">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg pointer-events-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400">Distância</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{order.distanceKm.toFixed(1)} km</p>
            </div>
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-full shadow-lg pointer-events-auto text-green-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>
      
      {driverInfo && (
        <RateDriverModal 
          isOpen={showRatingModal} 
          onClose={() => setShowRatingModal(false)}
          orderId={id!}
          driverName={driverInfo.name}
          driverAvatar={driverInfo.avatar}
        />
      )}
    </div>
  );
}
