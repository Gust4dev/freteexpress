import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import HomeDashboard from "../components/HomeDashboard";
import { 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Truck, 
  Star, 
  ChevronRight,
  Package
} from "lucide-react";

export default function Home({ openAuth }: { openAuth: () => void }) {
  const { user } = useAuth();

  if (user) {
    return <HomeDashboard />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Plataforma #1 em Logística Rápida
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                Logística <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Inteligente</span> para o seu Negócio
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Conectamos empresas e pessoas aos melhores entregadores da região. 
                Rastreamento em tempo real, segurança garantida e preços justos.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={openAuth}
                  className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1 active:translate-y-0 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Começar Agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient" />
                </button>
                
                <a
                  href="#features"
                  className="px-8 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Saiba Mais
                </a>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-gray-500 dark:text-gray-400 grayscale opacity-70">
                 {/* Placeholder logos or stats */}
                 <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Seguro</div>
                 <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> Rápido</div>
                 <div className="flex items-center gap-2"><Star className="w-5 h-5" /> 4.9/5</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Mock UI Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Entrega em Andamento</div>
                        <div className="text-xs text-gray-500">ID: #8832</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium animate-pulse">
                      Em Rota
                    </span>
                  </div>
                  
                  <div className="space-y-6 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />
                    
                    <div className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 z-10 flex items-center justify-center text-white shadow-lg">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="font-medium text-gray-900 dark:text-white">Saiu para entrega</div>
                        <div className="text-sm text-gray-500">14:30 - Av. Paulista, 1000</div>
                      </div>
                    </div>

                    <div className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 z-10 flex items-center justify-center text-gray-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="font-medium text-gray-400">Destino</div>
                        <div className="text-sm text-gray-500">Previsão: 15:15</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800" />
                       ))}
                    </div>
                    <div className="text-sm text-gray-500">Motorista avaliado 5.0 ★</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative floating elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">100%</div>
                    <div className="text-xs text-gray-500">Seguro</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tudo que você precisa para sua logística</h2>
            <p className="text-gray-600 dark:text-gray-300">Nossa plataforma oferece ferramentas completas para gerenciar suas entregas com eficiência e segurança.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-blue-600" />,
                title: "Rastreamento em Tempo Real",
                desc: "Acompanhe cada etapa da sua entrega com atualizações precisas de localização."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
                title: "Entregadores Verificados",
                desc: "Todos os nossos parceiros passam por um rigoroso processo de verificação."
              },
              {
                icon: <Clock className="w-6 h-6 text-orange-600" />,
                title: "Entregas Expressas",
                desc: "Algoritmos inteligentes para encontrar a rota mais rápida para seu destino."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Pronto para revolucionar suas entregas?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de empresas e entregadores que já usam nossa plataforma para crescer.
          </p>
          <button
            onClick={openAuth}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            Criar Conta Grátis <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </main>
  );
}
