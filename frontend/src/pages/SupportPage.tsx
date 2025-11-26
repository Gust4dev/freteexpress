import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  ShieldCheck, 
  BookOpen, 
  AlertTriangle, 
  ChevronDown, 
  Server, 
  MapPin, 
  UserCheck,
  HelpCircle,
  MessageCircle,
  FileText,
  DollarSign,
  Zap
} from "lucide-react";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const faqs = [
    {
      role: "Cliente",
      questions: [
        { id: "c1", q: "O motorista atrasou, o que fazer?", a: "Se o atraso for superior a 15 minutos, você pode cancelar a corrida sem taxas ou entrar em contato diretamente pelo chat." },
        { id: "c2", q: "Cobrança indevida no cartão?", a: "Verifique se não é apenas uma pré-autorização. Caso confirmado, abra um chamado financeiro abaixo." },
        { id: "c3", q: "Como funciona o PIN?", a: "O PIN de 4 dígitos aparece na sua tela após o motorista aceitar. Você deve informá-lo apenas na entrega." }
      ]
    },
    {
      role: "Motorista",
      questions: [
        { id: "d1", q: "O cliente não apareceu?", a: "Aguarde 10 minutos no local. Após isso, tente contato. Se sem resposta, cancele por 'Cliente ausente' para receber a taxa de deslocamento." },
        { id: "d2", q: "Endereço errado ou inacessível?", a: "Entre em contato com o suporte imediatamente para recalcular a rota ou autorizar o retorno." },
        { id: "d3", q: "Quando recebo meus ganhos?", a: "Os repasses são feitos semanalmente, toda quarta-feira, para a conta bancária cadastrada." }
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
      
      {/* Header de Diagnóstico */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-900 text-white py-8 px-4 lg:px-8 border-b border-gray-800 relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
                Central Técnica
              </h1>
              <p className="text-gray-400 text-base mt-2 ml-1">Monitoramento em tempo real e suporte especializado</p>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-6 bg-gray-800/50 p-4 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-xl"
            >
              <StatusIndicator label="Servidor" status="Online" color="green" />
              <div className="w-px bg-gray-700 h-10" />
              <StatusIndicator label="GPS" status="Ativo" color="green" />
              <div className="w-px bg-gray-700 h-10" />
              <StatusIndicator label="Conta" status="Verificada" color="blue" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-16"
      >
        
        {/* Base de Conhecimento */}
        <section>
          <motion.h2 variants={item} className="text-2xl font-bold mb-8 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Base de Conhecimento
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KnowledgeCard 
              icon={<ShieldCheck className="w-7 h-7" />}
              title="PIN de Segurança"
              desc="O código de 4 dígitos garante que a entrega foi feita à pessoa certa. Segurança total para ambas as partes."
              color="blue"
            />
            <KnowledgeCard 
              icon={<AlertTriangle className="w-7 h-7" />}
              title="Cancelamentos"
              desc="Entenda as taxas aplicáveis e os prazos para cancelar uma corrida sem custos adicionais."
              color="orange"
            />
            <KnowledgeCard 
              icon={<Zap className="w-7 h-7" />}
              title="Dicas de Uso"
              desc="Como embalar corretamente seus itens e maximizar a segurança e agilidade durante o transporte."
              color="purple"
            />
          </div>
        </section>

        {/* FAQ Accordion */}
        <section>
          <motion.h2 variants={item} className="text-2xl font-bold mb-8 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Resolução de Problemas
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((group, idx) => (
              <motion.div variants={item} key={idx} className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider ml-1 flex items-center gap-2">
                  {group.role === 'Cliente' ? <UserCheck className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  {group.role}
                </h3>
                <div className="space-y-3">
                  {group.questions.map((faq) => (
                    <motion.div 
                      key={faq.id} 
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      initial={false}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-gray-800 dark:text-gray-200">{faq.q}</span>
                        <motion.div
                          animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {openFaq === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="p-5 pt-0 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700/50">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Reportar Problema CTA */}
        <motion.section 
          variants={item}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl border border-gray-700"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
              className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" 
            />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto text-white mb-6 border border-white/10 shadow-inner">
              <MessageCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Ainda precisa de ajuda especializada?
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Nossa equipe técnica está disponível 24/7 para resolver situações complexas. Selecione a categoria abaixo para atendimento prioritário.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 transition-colors flex items-center justify-center gap-3 group"
              >
                <Activity className="w-5 h-5 group-hover:animate-pulse" />
                Abrir Chamado Técnico
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-3"
              >
                <DollarSign className="w-5 h-5 text-green-400" />
                Problema Financeiro
              </motion.button>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}

function StatusIndicator({ label, status, color }: { label: string, status: string, color: "green" | "blue" }) {
  const colorClass = color === "green" ? "text-green-400" : "text-blue-400";
  const bgClass = color === "green" ? "bg-green-500" : "bg-blue-500";

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${bgClass} animate-pulse`} />
        <div className={`absolute inset-0 w-3 h-3 rounded-full ${bgClass} animate-ping opacity-75`} />
      </div>
      <div className="text-xs">
        <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">{label}</p>
        <p className={`font-bold ${colorClass} text-sm`}>{status}</p>
      </div>
    </div>
  );
}

function KnowledgeCard({ icon, title, desc, color }: any) {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all group cursor-pointer"
    >
      <div className={`w-14 h-14 ${colors[color as keyof typeof colors]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}
