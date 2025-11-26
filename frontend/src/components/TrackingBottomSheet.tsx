import { motion } from "framer-motion";
import { 
  Phone, 
  MessageSquare, 
  Share2, 
  XCircle, 
  HelpCircle, 
  CheckCircle2, 
  Circle, 
  Clock,
  MapPin,
  Lock
} from "lucide-react";
import { OrderStatus } from "../api/fretes";

interface TrackingBottomSheetProps {
  order: {
    status: OrderStatus;
    distanceKm: number;
    confirmationCode?: string;
    transporterId?: {
      userId: {
        name: string;
        avatarUrl?: string;
        phone?: string;
      };
      vehicle?: {
        model: string;
        plate: string;
      };
      rating?: number;
    };
  };
  onCancel: () => void;
}

export default function TrackingBottomSheet({ order, onCancel }: TrackingBottomSheetProps) {
  
  // Timeline Steps
  const steps = [
    { status: 'accepted', label: 'Aceito' },
    { status: 'arrived_pickup', label: 'Coletando' },
    { status: 'in_route', label: 'Em Rota' },
    { status: 'delivered', label: 'Entregue' }
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  // If status is 'created', index is -1. If 'cancelled', handle separately.

  const getStepStatus = (index: number) => {
    if (order.status === 'cancelled') return 'cancelled';
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  const driverName = order.transporterId?.userId.name || "Motorista";
  const driverAvatar = order.transporterId?.userId.avatarUrl;
  const vehicleModel = order.transporterId?.vehicle?.model || "Veículo";
  const vehiclePlate = order.transporterId?.vehicle?.plate || "---";
  const rating = order.transporterId?.rating || 5.0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Acompanhe meu frete',
        text: `Acompanhe a entrega de ${driverName} pelo Frete Express!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10 flex flex-col max-h-[85vh] w-full absolute bottom-0 left-0"
    >
      {/* Handle Bar */}
      <div className="w-full flex justify-center pt-3 pb-1">
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      <div className="px-6 pb-8 pt-2 space-y-6 overflow-y-auto">
        
        {/* Header: Status Summary */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {order.status === 'created' ? "Aguardando Motorista..." :
             order.status === 'cancelled' ? "Pedido Cancelado" :
             order.status === 'delivered' ? "Entrega Finalizada!" :
             `${driverName.split(' ')[0]} está a caminho`}
          </h2>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <>
                <Clock className="w-4 h-4" />
                <span>Chegada em ~15 min ({order.distanceKm.toFixed(1)} km)</span>
              </>
            )}
          </p>
        </div>

        {/* Visual Timeline (Stepper) */}
        <div className="relative flex justify-between items-center px-2">
            {/* Progress Bar Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
            
            {/* Active Progress Bar */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 transition-all duration-500" 
              style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
            />

            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.status} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 px-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    status === 'completed' || status === 'current' 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                     status === 'current' ? <div className="w-3 h-3 bg-white rounded-full animate-pulse" /> :
                     <Circle className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    status === 'current' ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Driver Info Card (Tranquility Panel) */}
        {order.transporterId && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden">
                {driverAvatar ? (
                  <img src={driverAvatar} alt={driverName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                    {driverName[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border-2 border-white dark:border-gray-800">
                <span>★</span> {rating.toFixed(1)}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{driverName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span className="font-medium text-gray-700 dark:text-gray-300">{vehicleModel}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  {vehiclePlate}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PIN Display (Security) */}
        {order.confirmationCode && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl flex justify-between items-center">
             <div>
               <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Código de Segurança</p>
               <p className="text-xs text-gray-500">Informe ao motorista na entrega</p>
             </div>
             <div className="flex items-center gap-2">
               <Lock className="w-5 h-5 text-blue-500" />
               <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-widest">
                 {order.confirmationCode}
               </span>
             </div>
          </div>
        )}

        {/* Action Hub (Grid) */}
        <div className="grid grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Ligar</span>
          </button>

          <button className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Chat</span>
          </button>

          <button onClick={handleShare} className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Partilhar</span>
          </button>

          <button className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Ajuda</span>
          </button>
        </div>
        
        {/* Cancel Button (Secondary) */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
           <button 
             onClick={onCancel}
             className="w-full py-3 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
           >
             Cancelar Pedido
           </button>
        )}

      </div>
    </motion.div>
  );
}
