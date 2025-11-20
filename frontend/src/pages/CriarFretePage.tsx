import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../components/Spinner";
import { createFrete, CreateFreteDTO } from "../api/fretes";
import { calculateDistance } from "../api/utils";
import { MapPicker } from "../components/MapPicker";

type Coords = [number, number];
type LocationInfo = {
  address: string;
  coords: Coords;
};

function calcPisoMinimo(
  distanceKm: number,
  vehicleType: "moto" | "carro" | "caminhao"
) {
  const base = 6.0;
  const rateMap = { moto: 1.2, carro: 2.5, caminhao: 5.0 };
  const rate = rateMap[vehicleType];
  const unrounded = base + rate * distanceKm;
  return Math.round(unrounded * 100) / 100;
}

export default function CriarFretePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    peso: "",
    descricao: "",
    dataColeta: "",
    tipo: "pacote",
  });

  const [origin, setOrigin] = useState<LocationInfo | null>(null);
  const [destination, setDestination] = useState<LocationInfo | null>(null);
  const [currentSelection, setCurrentSelection] = useState<"origin" | "dest">("origin");

  const [routeCalculated, setRouteCalculated] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [pisoMinimo, setPisoMinimo] = useState(0);
  const [price, setPrice] = useState("");

  function getVehicleType(): "moto" | "carro" | "caminhao" {
    if (formData.tipo === "documentos") return "moto";
    if (formData.tipo === "moveis") return "caminhao";
    return "carro";
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRouteCalculated(false);
    setError(null);
  }

  function handleLocationSelect(coords: Coords, address: string) {
    if (currentSelection === "origin") {
      setOrigin({ address, coords });
      if (!destination) setCurrentSelection("dest");
    } else {
      setDestination({ address, coords });
    }
    setRouteCalculated(false);
    setError(null);
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice(e.target.value);
    setError(null);
  }

  async function handleCalculateRoute() {
    if (!origin || !destination) {
      setError("Defina um local de origem e destino no mapa.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { distanceKm: realDistance } = await calculateDistance(
        origin.coords,
        destination.coords
      );

      const vehicleType = getVehicleType();
      const piso = calcPisoMinimo(realDistance, vehicleType);

      setDistanceKm(realDistance);
      setPisoMinimo(piso);
      setRouteCalculated(true);
    } catch (err: any) {
      console.error(err);
      setError("Não foi possível calcular a rota.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!origin || !destination) {
      setError("Origem e destino são obrigatórios.");
      return;
    }

    if (!routeCalculated) {
      setError("Por favor, calcule a rota antes de publicar.");
      return;
    }

    const offeredPrice = parseFloat(price);
    if (isNaN(offeredPrice) || offeredPrice <= 0) {
      setError("Por favor, insira um preço válido.");
      return;
    }

    if (offeredPrice < pisoMinimo) {
      setError(`O preço ofertado (R$ ${offeredPrice.toFixed(2)}) está abaixo do piso mínimo (R$ ${pisoMinimo.toFixed(2)}).`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateFreteDTO = {
        origin: { address: origin.address, coords: origin.coords },
        destination: { address: destination.address, coords: destination.coords },
        distanceKm: distanceKm,
        price: offeredPrice,
        vehicleType: getVehicleType(),
      };

      await createFrete(payload);
      setLoading(false);
      navigate("/app");
    } catch (err: any) {
      console.error("Falha ao criar frete:", err);
      setError("Falha ao criar frete. Verifique os dados e tente novamente.");
      setLoading(false);
    }
  }

  const currentMapPosition = currentSelection === 'origin' ? origin?.coords : destination?.coords;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* --- Full Screen Map Background --- */}
      <div className="absolute inset-0 z-0">
        <MapPicker
          initialPosition={currentMapPosition}
          onLocationSelect={handleLocationSelect}
          className="h-full w-full rounded-none border-none"
        />
      </div>

      {/* --- Gradient Fade Overlay (Top) --- */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-transparent z-10 pointer-events-none"></div>

      {/* --- Content Overlay --- */}
      <div className="absolute inset-0 z-20 flex flex-col md:flex-row pointer-events-none">
        
        {/* Left Side: Header & Instructions (Floating) */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-start pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 md:mt-8 pointer-events-auto"
          >
            <button 
              onClick={() => navigate('/app')}
              className="text-white/80 hover:text-white flex items-center gap-2 mb-4 transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
              Novo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Frete</span>
            </h1>
            <p className="text-lg font-semibold text-white mt-2 max-w-md drop-shadow-lg bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl inline-block border border-white/10 shadow-xl">
              Selecione a origem e o destino no mapa para começar.
            </p>
          </motion.div>

          {/* Location Cards (Floating) */}
          <div className="mt-8 space-y-4 max-w-md pointer-events-auto">
             {/* Origin Button */}
             <button
                type="button"
                onClick={() => setCurrentSelection("origin")}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 backdrop-blur-md border ${
                  currentSelection === "origin"
                    ? "bg-blue-600/90 border-blue-400 shadow-lg shadow-blue-900/50 transform scale-105"
                    : "bg-gray-900/60 border-gray-700 hover:bg-gray-800/80 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full shadow-sm ${currentSelection === 'origin' ? 'bg-white' : 'bg-gray-500'}`}></div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80 text-white">Ponto de Coleta</div>
                    <div className="text-sm font-medium truncate text-white">
                      {origin?.address || "Toque no mapa para definir"}
                    </div>
                  </div>
                </div>
              </button>

              {/* Destination Button */}
              <button
                type="button"
                onClick={() => setCurrentSelection("dest")}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 backdrop-blur-md border ${
                  currentSelection === "dest"
                    ? "bg-indigo-600/90 border-indigo-400 shadow-lg shadow-indigo-900/50 transform scale-105"
                    : "bg-gray-900/60 border-gray-700 hover:bg-gray-800/80 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full shadow-sm ${currentSelection === 'dest' ? 'bg-white' : 'bg-gray-500'}`}></div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80 text-white">Destino Final</div>
                    <div className="text-sm font-medium truncate text-white">
                      {destination?.address || "Toque no mapa para definir"}
                    </div>
                  </div>
                </div>
              </button>
          </div>
        </div>

        {/* Right Side: Form (Glassmorphism) */}
        <div className="w-full md:w-1/2 flex items-end md:items-center justify-center md:justify-end p-4 md:p-8 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md pointer-events-auto max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                📦 Detalhes do Pedido
              </h2>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">O que enviar?</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="documentos">📄 Documentos (Moto)</option>
                  <option value="pacote">📦 Pacote Pequeno (Carro)</option>
                  <option value="caixa">📦 Caixa Média (Carro)</option>
                  <option value="moveis">🛋️ Móveis (Caminhão)</option>
                  <option value="outros">✨ Outros</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Peso (kg)</label>
                  <input
                    name="peso"
                    type="number"
                    value={formData.peso}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: 5"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Data</label>
                  <input
                    name="dataColeta"
                    type="date"
                    value={formData.dataColeta}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Observações</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] resize-none"
                  placeholder="Instruções para o entregador..."
                />
              </div>

              {/* Calculation Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {!routeCalculated ? (
                  <button
                    type="button"
                    onClick={handleCalculateRoute}
                    disabled={loading || !origin || !destination}
                    className="w-full py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                  >
                    {loading ? <Spinner /> : "Calcular Rota"}
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-800">
                      <div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Distância</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{distanceKm.toFixed(1)} km</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Sugerido</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">R$ {pisoMinimo.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 block">Sua Oferta (R$)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">R$</span>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={handlePriceChange}
                          className="w-full bg-white dark:bg-gray-800 border-2 border-green-500 rounded-xl pl-12 pr-4 py-3 text-xl font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-green-500/20 outline-none transition-all"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                    >
                      {loading ? <Spinner /> : "Confirmar e Publicar"}
                    </button>
                  </motion.div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center border border-red-100 dark:border-red-800">
                  {error}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}