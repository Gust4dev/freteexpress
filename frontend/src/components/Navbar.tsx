import { useState, useRef, useEffect } from "react";
import { getAvatarUrl } from "../utils/image";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/auth";
import logoIcon from "../assets/logo-icon.png";
import { 
  Bell, 
  Wallet, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  HelpCircle, 
  Moon, 
  Sun, 
  ChevronDown,
  LayoutDashboard,
  Home,
  MapPin,
  Clock,
  Search,
  Star,
  CreditCard,
  Ticket,
  FileText,
  Shield,
  Car,
  Sliders,
  CheckCircle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  darkMode,
  toggleTheme,
}: {
  darkMode: boolean;
  toggleTheme: () => void;
}) {
  const queryClient = useQueryClient();
  const { user, token, login, logout, viewMode, toggleViewMode } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock Notifications
  const notifications = [
    { id: 1, title: "Pagamento Recebido", message: "Você recebeu um pagamento de R$ 150,00.", time: "2 min atrás", type: "success", read: false },
    { id: 2, title: "Nova Mensagem", message: "O motorista João enviou uma mensagem.", time: "1 hora atrás", type: "info", read: false },
    { id: 3, title: "Frete Concluído", message: "A entrega #1234 foi finalizada com sucesso.", time: "3 horas atrás", type: "success", read: true },
    { id: 4, title: "Atualização de Sistema", message: "Novas funcionalidades disponíveis no app.", time: "1 dia atrás", type: "info", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleRole = () => {
    toggleViewMode();
  };

  const isActive = (path: string) => location.pathname === path;
  
  // Determine effective role for UI rendering
  const effectiveRole = viewMode || user?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-0 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full" />
              <img src={logoIcon} alt="Frete Express" className="relative w-20 h-20 rounded-xl object-cover transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl" />
            </div>
            <div className="flex flex-col leading-none group-hover:drop-shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-500">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Frete
              </span>
              <span className="text-2xl font-bold text-blue-600 tracking-tight -mt-1">
                Express
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              <Home className="w-4 h-4" />
              Início
            </Link>

            {/* Client Navigation */}
            {effectiveRole === 'client' && (
              <>
                <Link 
                  to="/fazer-frete" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/fazer-frete') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Novo Pedido
                </Link>
                <Link 
                  to="/rastreio" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/rastreio') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  <MapPin className="w-4 h-4" />
                  Rastreio
                </Link>
                <Link 
                  to="/historico" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/historico') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  <Clock className="w-4 h-4" />
                  Histórico
                </Link>
              </>
            )}

            {/* Driver Navigation */}
            {effectiveRole === 'driver' && (
              <>
                <Link 
                  to="/buscar-fretes" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/buscar-fretes') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  <Search className="w-4 h-4" />
                  Buscar Fretes
                </Link>
                <Link 
                  to="/carteira" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/carteira') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  <Wallet className="w-4 h-4" />
                  Carteira
                </Link>
              </>
            )}

            {/* Guest Navigation */}
            {!user && (
              <Link 
                to="/work" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/work') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                <UserIcon className="w-4 h-4" />
                Para Motoristas
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Notificações</h3>
                          <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Marcar todas como lidas</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div key={notification.id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                              <div className="flex gap-3">
                                <div className={`mt-1 p-1.5 rounded-full h-fit ${notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                  {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 text-center border-t border-gray-100 dark:border-gray-700">
                          <button className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Ver todas as notificações
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{user.name?.split(' ')[0]}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ver perfil</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <UserIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <UserIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-base font-bold text-gray-900 dark:text-white">{user.name}</p>
                              <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>4.9</span>
                              </div>
                            </div>
                          </div>
                          <Link 
                            to="/profile?tab=profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Editar perfil
                          </Link>
                        </div>

                        <div className="py-2">
                          {/* Context Aware Section */}
                          {effectiveRole === 'client' ? (
                            <>
                              <Link to="/carteira" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                Carteira / Pagamentos
                              </Link>
                              <Link to="/profile?tab=addresses" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Endereços Favoritos
                              </Link>
                              <Link to="/profile?tab=coupons" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <Ticket className="w-4 h-4 text-gray-400" />
                                Cupons
                              </Link>
                              <Link to="/profile?tab=history" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <Clock className="w-4 h-4 text-gray-400" />
                                Histórico Completo
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link to="/carteira" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <Wallet className="w-4 h-4 text-gray-400" />
                                Ganhos e Extrato
                              </Link>
                              <Link to="/profile?tab=documents" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Documentos
                              </Link>
                              <Link to="/profile?tab=preferences" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                Locais Favoritos
                              </Link>
                            </>
                          )}

                          <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                          <Link to="/profile?tab=settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <Settings className="w-4 h-4 text-gray-400" />
                            Configurações
                          </Link>
                          <Link to="/profile?tab=security" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <Shield className="w-4 h-4 text-gray-400" />
                            Segurança
                          </Link>
                          <Link to="/profile?tab=help" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                            Ajuda e Suporte
                          </Link>

                          <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                          {/* Mode Switcher - Only for Admin/Tester */}
                          {(user.role === 'admin' || user.role === 'tester') && (
                            <button 
                              onClick={handleToggleRole}
                              className="w-full flex items-center justify-between px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {effectiveRole === 'client' ? <Car className="w-4 h-4 text-gray-400" /> : <UserIcon className="w-4 h-4 text-gray-400" />}
                                <span>Modo {effectiveRole === 'client' ? 'Motorista' : 'Passageiro'}</span>
                              </div>
                              <div className={`w-8 h-4 rounded-full transition-colors relative ${effectiveRole === 'driver' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${effectiveRole === 'driver' ? 'left-4.5' : 'left-0.5'}`} />
                              </div>
                            </button>
                          )}

                           {/* Theme Switcher */}
                           <div className="flex items-center justify-between px-6 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={toggleTheme}>
                            <div className="flex items-center gap-3">
                              {darkMode ? <Moon className="w-4 h-4 text-gray-400" /> : <Sun className="w-4 h-4 text-gray-400" />}
                              <span>Modo Escuro</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full transition-colors relative ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${darkMode ? 'left-4.5' : 'left-0.5'}`} />
                            </div>
                          </div>

                          <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                          {/* Logout */}
                          <button 
                            onClick={() => { setIsProfileOpen(false); logout(); }}
                            className="w-full flex items-center gap-3 px-6 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            Sair da Conta
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Entrar
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium">
                <Home className="w-5 h-5" />
                Início
              </Link>

              {/* Mobile Client Links */}
              {effectiveRole === 'client' && (
                <>
                  <Link to="/fazer-frete" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium">
                    <LayoutDashboard className="w-5 h-5" />
                    Novo Pedido
                  </Link>
                  <Link to="/rastreio" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium">
                    <MapPin className="w-5 h-5" />
                    Rastreio
                  </Link>
                  <Link to="/historico" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium">
                    <Clock className="w-5 h-5" />
                    Histórico
                  </Link>
                </>
              )}

              {/* Mobile Driver Links */}
              {effectiveRole === 'driver' && (
                <>
                  <Link to="/buscar-fretes" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium">
                    <Search className="w-5 h-5" />
                    Buscar Fretes
                  </Link>
                  <Link to="/carteira" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium">
                    <Wallet className="w-5 h-5" />
                    Carteira
                  </Link>
                </>
              )}
              
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white font-medium">
                    <UserIcon className="w-5 h-5" />
                    Meu Perfil
                  </Link>

                  {/* Mobile Mode Switcher - Only for Admin/Tester */}
                  {(user.role === 'admin' || user.role === 'tester') && (
                    <button 
                      onClick={handleToggleRole}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-center gap-3">
                        {effectiveRole === 'client' ? <Car className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                        <span>Modo {effectiveRole === 'client' ? 'Motorista' : 'Passageiro'}</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-colors relative ${effectiveRole === 'driver' ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${effectiveRole === 'driver' ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                  )}

                  <button 
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <span>Tema Escuro</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-colors relative ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${darkMode ? 'left-6' : 'left-1'}`} />
                    </div>
                  </button>

                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 font-medium"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}