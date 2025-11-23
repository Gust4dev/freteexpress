import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Truck, 
  Package, 
  Star, 
  Clock, 
  CheckCircle, 
  MapPin, 
  DollarSign, 
  Users, 
  ChevronDown, 
  Smartphone,
  Bike,
  Car,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DriverHome from "../components/DriverHome";
import ClientHome from "../components/ClientHome";
import logo from "../assets/logo.png";

export default function Home({ openAuth }: { openAuth: () => void }) {
  const { user, viewMode } = useAuth();
  const effectiveRole = viewMode || user?.role;

  if (effectiveRole === "driver") return <DriverHome />;
  if (effectiveRole === "client") return <ClientHome />;

  return (
    <div className="relative overflow-hidden bg-[#0B0E14] min-h-screen font-sans text-gray-300 selection:bg-blue-500/30">
      
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Gradientes de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Conteúdo esquerda */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Plataforma #1 em Logística Rápida
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Logística <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  Inteligente
                </span> para <br />
                o seu Negócio
              </h1>

              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Conectamos empresas e pessoas aos melhores entregadores da região. Rastreamento em tempo real, segurança garantida e preços justos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={openAuth}
                  className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Começar Agora <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Saiba Mais
                </button>
              </div>

              <div className="pt-8 flex items-center gap-8 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-400" />
                  Seguro
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Rápido
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  4.9/5
                </div>
              </div>
            </motion.div>

            {/* Visual direita */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center z-10"
            >
              {/* Container Tablet */}
              <div className="relative w-full max-w-md bg-[#1A1F2E] rounded-[2rem] border border-gray-800 p-6 shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500 group">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Entrega em Andamento</h3>
                      <p className="text-xs text-gray-400">ID: #8832</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                    Em Rota
                  </span>
                </div>

                {/* Linha do tempo */}
                <div className="relative pl-4 border-l-2 border-gray-700 space-y-8 mb-8">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-[#1A1F2E]" />
                    <h4 className="text-white font-medium">Saiu para entrega</h4>
                    <p className="text-sm text-gray-400">14:30 - Av. Paulista, 1000</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-gray-600 border-4 border-[#1A1F2E] group-hover:bg-blue-500 transition-colors duration-500" />
                    <h4 className="text-white font-medium">Destino</h4>
                    <p className="text-sm text-gray-400">Previsão: 15:15</p>
                  </div>
                </div>

                {/* Info motorista */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-800">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#1A1F2E]" />
                    <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#1A1F2E]" />
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#1A1F2E]" />
                  </div>
                  <p className="text-xs text-gray-400 ml-auto">Motorista avaliado 5.0 ★</p>
                </div>

                {/* Badge Seguro */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-[#1A1F2E] p-4 rounded-2xl border border-gray-700 shadow-xl flex items-center gap-3"
                >
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">100%</p>
                    <p className="text-xs text-gray-400">Seguro</p>
                  </div>
                </motion.div>
              </div>

              {/* Badge Motorista */}
               <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 left-0 bg-[#1A1F2E] p-4 rounded-2xl border border-gray-700 shadow-xl flex items-center gap-3 z-20"
                >
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Motorista a caminho</p>
                    <p className="text-xs text-gray-400">Chega em 5 min</p>
                  </div>
                </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* Empresas parceiras */}
      <section className="py-10 border-y border-white/5 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">Empresas que confiam na Frete Express</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['TechCorp', 'LogiFast', 'GlobalTrade', 'EcoDelivery', 'SmartShip'].map((company) => (
              <span key={company} className="text-xl font-bold text-white">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Como Funciona?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Simplificamos a logística para você focar no que importa. Em apenas 4 passos, sua carga chega ao destino.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <DollarSign className="w-6 h-6" />, title: "1. Cotação Instantânea", desc: "Digite os endereços e veja o preço na hora, sem surpresas." },
              { icon: <Users className="w-6 h-6" />, title: "2. Match Inteligente", desc: "Nossa tecnologia encontra o motorista ideal mais próximo." },
              { icon: <MapPin className="w-6 h-6" />, title: "3. Rastreio em Tempo Real", desc: "Acompanhe o trajeto da sua encomenda pelo mapa ao vivo." },
              { icon: <CheckCircle className="w-6 h-6" />, title: "4. Entrega Segura", desc: "Confirmação digital e seguro total para sua tranquilidade." }
            ].map((step, index) => (
              <div key={index} className="relative p-6 rounded-2xl bg-[#1A1F2E] border border-gray-800 hover:border-blue-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-24 bg-[#1A1F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">O veículo certo para sua necessidade</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">De documentos urgentes a mudanças completas, temos a frota ideal para você.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Bike className="w-8 h-8" />, title: "Moto Frete", price: "A partir de R$ 15,90", desc: "Ideal para documentos, chaves e pequenos pacotes. O mais rápido no trânsito." },
              { icon: <Car className="w-8 h-8" />, title: "Utilitários", price: "A partir de R$ 49,90", desc: "Perfeito para compras de mercado, caixas médias e eletrodomésticos pequenos." },
              { icon: <Truck className="w-8 h-8" />, title: "Caminhões", price: "A partir de R$ 120,00", desc: "Para mudanças, móveis grandes e cargas volumosas. Ajudantes inclusos." }
            ].map((service, index) => (
              <div key={index} className="p-8 rounded-3xl bg-[#0B0E14] border border-gray-800 hover:border-blue-500/30 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-white mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-blue-400 font-medium mb-4">{service.price}</p>
                <p className="text-gray-400 mb-8">{service.desc}</p>
                <button onClick={openAuth} className="w-full py-3 rounded-xl border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors">
                  Solicitar Agora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para motoristas */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent opacity-80" />
                <div className="bg-gray-800 h-[500px] w-full flex items-center justify-center">
                   <Smartphone className="w-32 h-32 text-gray-600" />
                   <p className="absolute text-gray-500 font-medium">App do Motorista</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium text-sm">
                <DollarSign className="w-4 h-4" />
                Renda Extra ou Principal
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Dirija com a Frete Express</h2>
              <p className="text-xl text-gray-400">
                Transforme seu veículo em uma máquina de fazer dinheiro. Você define seus horários, escolhe as entregas e recebe na hora.
              </p>
              <ul className="space-y-4">
                {[
                  "Pagamento instantâneo após cada entrega",
                  "Flexibilidade total de horários",
                  "Suporte 24h para parceiros",
                  "Clube de benefícios e descontos em combustível"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register?role=driver" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-colors">
                Cadastrar meu Veículo <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-24 bg-[#1A1F2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">O que dizem sobre nós</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Carlos Silva", role: "Cliente", text: "Precisava entregar um contrato urgente e a Frete Express salvou meu dia. O motoboy chegou em 10 minutos!", stars: 5 },
              { name: "Ana Souza", role: "E-commerce", text: "Uso para todas as entregas da minha loja. Meus clientes adoram o rastreio em tempo real.", stars: 5 },
              { name: "Roberto Dias", role: "Motorista Parceiro", text: "O melhor app para trabalhar. O suporte funciona e o pagamento cai na hora. Recomendo!", stars: 5 }
            ].map((testimonial, index) => (
              <div key={index} className="p-8 rounded-2xl bg-[#0B0E14] border border-gray-800">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dúvidas Frequentes</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Como é calculado o preço do frete?", a: "O preço é calculado com base na distância, tipo de veículo necessário e urgência da entrega. Você vê o valor final antes de confirmar." },
              { q: "A carga tem seguro?", a: "Sim! Todas as entregas realizadas pela plataforma contam com seguro contra roubo e acidentes, sem custo adicional." },
              { q: "Quais cidades vocês atendem?", a: "Atualmente atendemos toda a região metropolitana de São Paulo, Rio de Janeiro e Belo Horizonte." },
              { q: "Como faço para ser um motorista parceiro?", a: "Basta baixar nosso app, clicar em 'Cadastrar Veículo', enviar seus documentos e aguardar a aprovação, que geralmente leva 24h." }
            ].map((faq, index) => (
              <FaqItem key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#05080F] pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Frete Express" className="w-10 h-10 rounded-xl" />
                <span className="text-xl font-bold text-white">Frete Express</span>
              </div>
              <p className="text-gray-500 text-sm">
                Revolucionando a logística urbana com tecnologia e segurança.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Instagram className="w-5 h-5" />} />
                <SocialIcon icon={<Facebook className="w-5 h-5" />} />
                <SocialIcon icon={<Twitter className="w-5 h-5" />} />
                <SocialIcon icon={<Linkedin className="w-5 h-5" />} />
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Empresa</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Sobre Nós</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Carreiras</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Imprensa</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Termos de Uso</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacidade</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Segurança</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Compliance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contato</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  contato@freteexpress.com
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  0800 123 4567
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  Av. Paulista, 1000 - SP
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2024 Frete Express. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <span>Feito com ❤️ no Brasil</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-800 rounded-xl bg-[#1A1F2E] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
      >
        <span className="font-bold text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-gray-400">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
      {icon}
    </a>
  );
}
