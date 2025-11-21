import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, ArrowRight, Package, DollarSign } from "lucide-react";
import MapDisplay from "../components/MapDisplay";

export default function FindFreightsPage() {
  // Mock data
  const freights = [
    { id: 1, origin: "Centro, SP", destination: "Pinheiros, SP", price: 45.00, distance: "5.2 km", items: "Documentos", coords: [-23.5505, -46.6333] },
    { id: 2, origin: "Vila Mariana, SP", destination: "Moema, SP", price: 32.50, distance: "3.1 km", items: "Caixa Pequena", coords: [-23.5895, -46.6346] },
    { id: 3, origin: "Tatuapé, SP", destination: "Barra Funda, SP", price: 58.00, distance: "12.5 km", items: "Eletrônicos", coords: [-23.5409, -46.5741] },
  ];

  const [selectedFreight, setSelectedFreight] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Buscar Fretes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Encontre as melhores entregas próximas a você</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por região..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
            <button className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
             <MapDisplay 
               center={[-23.5505, -46.6333]}
               zoom={12}
               markers={freights.map(f => ({
                 id: f.id,
                 position: f.coords as [number, number],
                 title: `R$ ${f.price.toFixed(2)}`,
                 description: `${f.origin} -> ${f.destination}`
               }))}
             />
             
             {/* Floating Info when selected */}
             {selectedFreight && (
               <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 z-[400] flex justify-between items-center">
                 <div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">Frete Selecionado</p>
                   <p className="text-xs text-gray-500">Distância: {freights.find(f => f.id === selectedFreight)?.distance}</p>
                 </div>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
                   Aceitar Corrida
                 </button>
               </div>
             )}
          </div>

          {/* List Section */}
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {freights.map((freight, index) => (
              <motion.div
                key={freight.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedFreight(freight.id)}
                className={`p-5 rounded-2xl shadow-sm border transition-all cursor-pointer group ${
                  selectedFreight === freight.id 
                    ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500 ring-1 ring-blue-500' 
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${selectedFreight === freight.id ? 'bg-blue-200 text-blue-700' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    R$ {freight.price.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{freight.origin}</p>
                  </div>
                  <div className="w-0.5 h-4 bg-gray-200 dark:bg-gray-700 ml-1" />
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{freight.destination}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {freight.distance}
                  </span>
                  <button className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Aceitar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
