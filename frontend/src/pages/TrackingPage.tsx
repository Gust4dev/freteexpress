import { motion } from "framer-motion";
import { MapPin, Clock, Phone, MessageSquare, Shield, CheckCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { LatLng } from 'leaflet';

export default function TrackingPage() {
  // Mock active order
  const order = {
    id: "PED-9921",
    status: "Em trânsito",
    driver: {
      name: "Carlos Mendes",
      vehicle: "Honda CG 160 - ABC-1234",
      rating: 4.9,
      phone: "(11) 99999-9999",
      avatar: "https://i.pravatar.cc/150?u=carlos"
    },
    origin: "Rua Augusta, 1500 - Consolação, SP",
    destination: "Av. Paulista, 1000 - Bela Vista, SP",
    eta: "14:45",
    progress: 65
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Status & Details */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Status do Pedido</h2>
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold animate-pulse">
                {order.status}
              </span>
            </div>

            <div className="relative py-4">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              
              <div className="relative flex gap-4 mb-8">
                <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 z-10 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Coleta realizada</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{order.origin}</p>
                  <p className="text-xs text-gray-400 mt-1">14:10</p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 z-10 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Destino</p>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{order.destination}</p>
                  <p className="text-xs text-blue-500 font-bold mt-1">Previsão: {order.eta}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Motorista</h3>
            <div className="flex items-center gap-4 mb-6">
              <img src={order.driver.avatar} alt={order.driver.name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{order.driver.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.driver.vehicle}</p>
                <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                  <span>★</span> {order.driver.rating}
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
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2 h-[500px] lg:h-auto bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden relative shadow-inner z-0">
          <MapContainer 
            center={[-23.561, -46.655]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-23.5505, -46.6333]}>
              <Popup>Coleta: Rua Augusta, 1500</Popup>
            </Marker>
            <Marker position={[-23.561, -46.655]}>
              <Popup>Destino: Av. Paulista, 1000</Popup>
            </Marker>
            <Polyline positions={[[-23.5505, -46.6333], [-23.561, -46.655]]} color="blue" />
          </MapContainer>
          
          {/* Overlay Info */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-[1000]">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg pointer-events-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400">Tempo Restante</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">12 min</p>
            </div>
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-full shadow-lg pointer-events-auto text-green-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
