import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "../api/auth";
import logo from "../assets/logo.png";
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
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  darkMode,
  toggleTheme,
  onOpenProfile,
}: {
  darkMode: boolean;
  toggleTheme: () => void;
  onOpenProfile: () => void;
}) {
  const queryClient = useQueryClient();
  const { user, token, login, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      login(token || "", updatedUser, true);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      console.error("Falha ao trocar role", err);
    },
  });

  const handleToggleRole = () => {
    if (!user) return;
    const newRole = user.role === "client" ? "driver" : "client";
    roleMutation.mutate({ role: newRole });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
              <img src={logo} alt="Frete Express" className="relative w-10 h-10 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Frete Express
            </span>
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
            {user?.role === 'client' && (
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
            {user?.role === 'driver' && (
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
                {/* Role Switcher */}
                <button
                  onClick={handleToggleRole}
                  disabled={roleMutation.isPending}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-2 h-2 rounded-full ${user.role === 'driver' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  {user.role === 'client' ? 'Cliente' : 'Motorista'}
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                {/* Wallet (Driver Only) */}
                {user.role === 'driver' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-bold">R$ 1.250,00</span>
                  </div>
                )}

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                </button>

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
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-2"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>

                        <button 
                          onClick={() => { setIsProfileOpen(false); onOpenProfile(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          Meu Perfil
                        </button>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <Settings className="w-4 h-4" />
                          Configurações
                        </button>

                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                          Ajuda e Suporte
                        </button>

                        <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                        <div className="px-4 py-2 flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3">
                            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            Tema {darkMode ? 'Escuro' : 'Claro'}
                          </span>
                          <button 
                            onClick={toggleTheme}
                            className={`w-10 h-5 rounded-full transition-colors relative ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                          >
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${darkMode ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>

                        <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                        <button 
                          onClick={() => { setIsProfileOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair da Conta
                        </button>
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
              {user?.role === 'client' && (
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
              {user?.role === 'driver' && (
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
                  <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
                  
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm font-medium text-gray-500">Modo {user.role === 'client' ? 'Cliente' : 'Motorista'}</span>
                    <button
                      onClick={handleToggleRole}
                      className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold"
                    >
                      Trocar
                    </button>
                  </div>

                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); onOpenProfile(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <UserIcon className="w-5 h-5" />
                    Meu Perfil
                  </button>

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