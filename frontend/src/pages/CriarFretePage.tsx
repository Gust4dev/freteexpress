import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";
import { createFrete, CreateFreteDTO } from "../api/fretes";
import { calculateDistance } from "../api/utils";
import CityAsyncSelect from "../components/CityAsyncSelect";

function calcPisoMinimo(
  distanceKm: number,
  vehicleType: "moto" | "carro" | "caminhao"
) {
  const base = 6.0;
  const rateMap = { moto: 1.2, carro: 2.5, caminhao: 5.0 };
  const rate = rateMap[vehicleType];
  const unrounded = base + rate * distanceKm;
  const rounded = Math.round(unrounded * 100) / 100;
  return rounded;
}

export default function CriarFretePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    peso: "",
    descricao: "",
    dataColeta: "",
    tipo: "pacote",
  });

  const [routeCalculated, setRouteCalculated] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [pisoMinimo, setPisoMinimo] = useState(0);
  const [price, setPrice] = useState("");

  function getVehicleType(): "moto" | "carro" | "caminhao" {
    if (formData.tipo === "documentos") return "moto";
    if (formData.tipo === "moveis") return "caminhao";
    return "carro";
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRouteCalculated(false);
    setError(null);
  }

  function handleAddressChange(name: "origem" | "destino", value: string) {
    setFormData({ ...formData, [name]: value });
    setRouteCalculated(false);
    setError(null);
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice(e.target.value);
    setError(null);
  }

  async function handleCalculateRoute() {
    if (!formData.origem || !formData.destino) {
      setError("Preencha origem e destino para calcular a rota.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { distanceKm: realDistance } = await calculateDistance(
        formData.origem,
        formData.destino
      );

      const vehicleType = getVehicleType();
      const piso = calcPisoMinimo(realDistance, vehicleType);

      setDistanceKm(realDistance);
      setPisoMinimo(piso);
      setRouteCalculated(true);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.response?.data?.error;
      if (errorMsg === "geocode_failed") {
        setError(
          "Não foi possível encontrar os endereços. Tente ser mais específico."
        );
      } else {
        setError("Não foi possível calcular a rota. Verifique os dados.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
      setError(
        `O preço ofertado (R$ ${offeredPrice.toFixed(
          2
        )}) está abaixo do piso mínimo (R$ ${pisoMinimo.toFixed(2)}).`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateFreteDTO = {
        origin: { address: formData.origem },
        destination: { address: formData.destino },
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

  return (
    <div className="min-h-[80vh] p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Criar novo frete
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Preencha os dados abaixo e receba propostas de entregadores.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                  Endereço de Origem
                </label>
                <CityAsyncSelect
                  placeholder="Digite uma cidade..."
                  onChange={(value) => handleAddressChange("origem", value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                  Endereço de Destino
                </label>
                <CityAsyncSelect
                  placeholder="Digite uma cidade..."
                  onChange={(value) => handleAddressChange("destino", value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                  Tipo de carga (Veículo)
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="documentos">Documentos (Moto)</option>
                  <option value="pacote">Pacote pequeno (Carro)</option>
                  <option value="caixa">Caixa média (Carro)</option>
                  <option value="moveis">Móveis (Caminhão)</option>
                  <option value="outros">Outros (Carro)</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                  Peso aproximado (kg)
                </label>
                <input
                  name="peso"
                  type="number"
                  value={formData.peso}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ex: 5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                Data para coleta
              </label>
              <input
                name="dataColeta"
                type="date"
                value={formData.dataColeta}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 space-y-4">
              <button
                type="button"
                onClick={handleCalculateRoute}
                disabled={loading}
                className="btn-primary w-full bg-gray-600 hover:bg-gray-700"
                style={{
                  background: "linear-gradient(135deg, #4b5563, #1f2937)",
                }}
              >
                {loading && !routeCalculated ? (
                  <Spinner />
                ) : (
                  "1. Calcular Rota e Piso Mínimo"
                )}
              </button>

              {routeCalculated && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Distância (linha reta):{" "}
                    <b className="font-semibold">{distanceKm.toFixed(1)} km</b>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    Piso Mínimo ANTT:{" "}
                    <b className="font-semibold">R$ {pisoMinimo.toFixed(2)}</b>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                      2. Preço Ofertado (R$)
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={handlePriceChange}
                      className="input-field"
                      placeholder={`Mínimo R$ ${pisoMinimo.toFixed(2)}`}
                      required
                      disabled={!routeCalculated}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-2 block">
                Descrição adicional (Opcional)
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="input-field min-h-[100px] resize-none"
                placeholder="Informações adicionais sobre o frete..."
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center -mb-2">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading || !routeCalculated}
              >
                {loading ? <Spinner /> : "Publicar frete"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/app")}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
