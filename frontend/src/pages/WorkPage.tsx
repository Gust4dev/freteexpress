import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Shield, 
  Smartphone, 
  Star, 
  MapPin, 
  TrendingUp,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans text-gray-300 selection:bg-green-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Seja um Parceiro Frete Express
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Faça fretes, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  ganhe por rota
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Cadastre-se como prestador e receba ofertas na sua área. Veja avaliações, histórico e ganhos — tudo em um painel simples e transparente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/register?role=driver"
                  className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Começar Agora <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Pagamento Rápido
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  +5.000 Motoristas
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visuals (App Mockup) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              <div className="relative w-[320px] h-[640px] bg-[#1A1F2E] rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                {/* Mock App Header */}
                <div className="bg-gray-900 p-6 pb-4 border-b border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700" />
                    <div className="w-20 h-4 rounded-full bg-gray-800" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs">Ganhos da Semana</p>
                    <h3 className="text-3xl font-bold text-white">R$ 1.280,00</h3>
                  </div>
                </div>

                {/* Mock App Content */}
                <div className="p-4 space-y-4">
                  {/* Active Order Card */}
                  <div className="bg-green-600 rounded-2xl p-4 text-white shadow-lg shadow-green-900/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg">Nova Oferta</p>
                        <p className="text-green-100 text-sm">Há 2 min</p>
                      </div>
                      <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold">R$ 45,00</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span>Centro, Rua A</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-200" />
                        <span>Bela Vista, Av B</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-white text-green-700 font-bold rounded-xl">Aceitar Corrida</button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                      <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-2xl font-bold text-white">24</p>
                      <p className="text-xs text-gray-400">Corridas</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                      <Star className="w-5 h-5 text-yellow-500 mb-2" />
                      <p className="text-2xl font-bold text-white">4.9</p>
                      <p className="text-xs text-gray-400">Avaliação</p>
                    </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-4 right-4 bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl border border-gray-700 shadow-xl flex items-center gap-3"
                >
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Pagamento Recebido</p>
                    <p className="text-xs text-gray-400">Você recebeu R$ 150,00</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-24 bg-[#1A1F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Por que ser um parceiro?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Oferecemos as melhores condições do mercado para você focar no que sabe fazer de melhor.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <DollarSign className="w-8 h-8" />, title: "Pagamento Rápido", desc: "Receba seus ganhos logo após a conclusão das corridas ou semanalmente." },
              { icon: <Clock className="w-8 h-8" />, title: "Horário Flexível", desc: "Você é seu próprio chefe. Ligue o app quando quiser trabalhar." },
              { icon: <Shield className="w-8 h-8" />, title: "Segurança Total", desc: "Monitoramento 24h e seguro para você e para a carga." },
              { icon: <Smartphone className="w-8 h-8" />, title: "App Fácil de Usar", desc: "Interface intuitiva projetada para facilitar o seu dia a dia." },
              { icon: <TrendingUp className="w-8 h-8" />, title: "Alta Demanda", desc: "Milhares de pedidos todos os dias. Nunca fique parado." },
              { icon: <Users className="w-8 h-8" />, title: "Suporte Humano", desc: "Equipe dedicada para te ajudar em qualquer situação." }
            ].map((item, index) => (
              <div key={index} className="p-8 rounded-3xl bg-[#0B0E14] border border-gray-800 hover:border-green-500/30 transition-all hover:-translate-y-1 group">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 group-hover:bg-green-500/20 flex items-center justify-center text-white group-hover:text-green-400 transition-colors mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Como começar?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">É simples, rápido e 100% digital.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-800 -z-10" />

            {[
              { step: "01", title: "Cadastre-se", desc: "Preencha seus dados e envie os documentos do veículo pelo app." },
              { step: "02", title: "Aprovação", desc: "Nossa equipe analisa seu perfil rapidamente. Você recebe o aviso por email." },
              { step: "03", title: "Comece a Ganhar", desc: "Fique online, aceite as ofertas próximas e faça sua primeira entrega." }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-[#1A1F2E] border-4 border-[#0B0E14] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/register?role=driver"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-xl shadow-lg shadow-green-500/25 transition-all hover:scale-105 active:scale-95"
            >
              Quero me Cadastrar <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER (Simplified) --- */}
      <footer className="bg-[#05080F] py-12 border-t border-gray-800 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-500 text-sm">© 2024 Frete Express. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
