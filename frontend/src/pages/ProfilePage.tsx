import { useState, useRef, useEffect } from "react";
import { getAvatarUrl } from "../utils/image";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFretes, OrderStatus } from "../api/fretes";
import { updateMe } from "../api/auth";
import api from "../api/apiClient";
import { 
  User as UserIcon, 
  Settings, 
  LayoutDashboard, 
  Camera, 
  LogOut,
  Package,
  Truck,
  CheckCircle,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  FileText,
  ChevronRight,
  X,
  Wallet,
  MapPin,
  Ticket,
  Clock,
  FileCheck,
  Sliders
} from "lucide-react";

type Order = {
  _id: string;
  status: OrderStatus;
};

// Simple Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
      type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
    }`}
  >
    {type === "success" ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

export default function ProfilePage() {
  const { user, logout, login, token, darkMode, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _queryClient = useQueryClient();
  
  type TabType = "overview" | "profile" | "settings" | "wallet" | "addresses" | "coupons" | "history" | "documents" | "preferences" | "security" | "help";
  const activeTab = (searchParams.get("tab") as TabType) || "profile";

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab });
  };
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings State (Mock)
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders", user?.role],
    queryFn: listFretes,
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      login(token || "", updatedUser, true);
      setIsEditing(false);
      showToast("Perfil atualizado com sucesso!", "success");
    },
    onError: () => {
      showToast("Erro ao atualizar perfil.", "error");
    }
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      login(token || "", res.data, true);
      showToast("Foto de perfil atualizada!", "success");
    } catch (err) {
      console.error("Erro ao enviar foto", err);
      showToast("Erro ao enviar foto. Tente novamente.", "error");
    }
  };

  const handleSaveProfile = () => {
    updateMutation.mutate(formData);
  };

  const activeOrders = orders?.filter(o => o.status === "accepted" || o.status === "in_route").length || 0;
  const completedOrders = orders?.filter(o => o.status === "delivered").length || 0;
  const availableOrders = orders?.filter(o => o.status === "created").length || 0;

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
    { id: "profile", label: "Meu Perfil", icon: UserIcon },
    { id: "wallet", label: "Carteira", icon: Wallet },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8 relative overflow-hidden transition-colors duration-500"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-600 shadow-lg transition-colors duration-500">
                {user?.avatarUrl ? (
                  <img src={getAvatarUrl(user.avatarUrl)} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">
                Olá, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 transition-colors duration-500">
                <span className={`w-2 h-2 rounded-full ${user?.role === 'driver' ? 'bg-green-500' : 'bg-blue-500'}`} />
                {user?.role === 'driver' ? 'Motorista Parceiro' : 'Cliente Verificado'}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => navigate(user?.role === 'client' ? '/fazer-frete' : '/app')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                {user?.role === 'client' ? 'Novo Pedido' : 'Ver Entregas'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-white/50 dark:hover:bg-gray-800/50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4 transition-colors duration-500">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-500">
                    {isLoading ? "..." : activeOrders}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">Pedidos Ativos</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 mb-4 transition-colors duration-500">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-500">
                    {isLoading ? "..." : completedOrders}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">Concluídos</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-4 transition-colors duration-500">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-500">
                    {isLoading ? "..." : availableOrders}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">Disponíveis</div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto transition-colors duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-500">Informações Pessoais</h3>
                  <button 
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isEditing 
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {isEditing ? "Salvar Alterações" : "Editar Perfil"}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Nome Completo</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 transition-all text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Email</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-transparent opacity-60 cursor-not-allowed transition-all text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Telefone</label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 transition-all text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder Tabs */}
            {["wallet", "addresses", "coupons", "history", "documents", "preferences", "security", "help"].includes(activeTab) && (
               <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto text-center transition-colors duration-500">
                 <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    {activeTab === "wallet" && <Wallet className="w-10 h-10 text-gray-400" />}
                    {activeTab === "addresses" && <MapPin className="w-10 h-10 text-gray-400" />}
                    {activeTab === "coupons" && <Ticket className="w-10 h-10 text-gray-400" />}
                    {activeTab === "history" && <Clock className="w-10 h-10 text-gray-400" />}
                    {activeTab === "documents" && <FileCheck className="w-10 h-10 text-gray-400" />}
                    {activeTab === "preferences" && <MapPin className="w-10 h-10 text-gray-400" />}
                    {activeTab === "security" && <Shield className="w-10 h-10 text-gray-400" />}
                    {activeTab === "help" && <HelpCircle className="w-10 h-10 text-gray-400" />}
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                   {activeTab === "wallet" ? "Carteira & Pagamentos" : activeTab === "preferences" ? "Locais Favoritos" : activeTab}
                 </h2>
                 <p className="text-gray-500 dark:text-gray-400">
                   Esta funcionalidade estará disponível em breve.
                 </p>
               </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl space-y-8 mx-auto transition-colors duration-500">
                
                {/* Account Security */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-500">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Segurança e Verificação
                  </h3>
                  <div className="space-y-3">
                     <button 
                      onClick={() => showToast("Solicitação de verificação enviada!", "success")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Solicitar Verificação de Conta</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                    <button 
                      onClick={() => showToast("Email de redefinição enviado!", "success")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Alterar Senha</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                    <button 
                      onClick={() => showToast("Entre em contato com o suporte.", "success")}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Alterar Email</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-500">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Notificações
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-4 transition-colors duration-500">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Notificações Push</span>
                      <button 
                        onClick={() => setNotifications(prev => ({...prev, push: !prev.push}))}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications.push ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${notifications.push ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Emails Promocionais</span>
                      <button 
                        onClick={() => setNotifications(prev => ({...prev, email: !prev.email}))}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications.email ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${notifications.email ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">SMS</span>
                      <button 
                        onClick={() => setNotifications(prev => ({...prev, sms: !prev.sms}))}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${notifications.sms ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${notifications.sms ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-500">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    Aparência
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 transition-colors duration-500">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Modo Escuro</span>
                      <button 
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${darkMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${darkMode ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-500">
                    <HelpCircle className="w-5 h-5 text-orange-600" />
                    Suporte
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Central de Ajuda</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                      <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-500">Termos de Uso</span>
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-500">
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair da Conta
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
