/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { Sparkles, Keyboard, MousePointer2, Settings, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'demo'>('overview');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Smart Write Companion</h1>
          </div>
          <nav className="flex gap-6">
            {['overview', 'setup', 'demo'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-sm font-medium capitalize transition-colors ${
                  activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-16"
            >
              <section className="text-center space-y-4">
                <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">Seu assistente de escrita inteligente.</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Uma extensão para Chrome que utiliza o poder do Google Gemini para corrigir gramática e reescrever textos em tempo real.
                </p>
              </section>

              {/* Playground Section */}
              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Keyboard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Campo de Teste (Playground)</h3>
                      <p className="text-sm text-slate-500">Experimente o atalho Ctrl + Ctrl aqui após instalar a extensão.</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Pronto para teste
                  </div>
                </div>

                <textarea
                  placeholder="Digite algo aqui... Ex: 'Eu não sabia que eles tinha chegado cedo.'"
                  className="w-full h-40 p-6 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-lg leading-relaxed placeholder:text-slate-300"
                />

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">Sugestões:</span>
                  {["Nós vai na feira.", "O livro é muito bom, eu gostei muito.", "Eles não sabe de nada."].map((s, i) => (
                    <button 
                      key={i}
                      onClick={(e) => {
                        const textarea = (e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement);
                        textarea.value = s;
                        textarea.focus();
                      }}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors"
                    >
                      "{s}"
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Keyboard className="w-6 h-6 text-blue-500" />}
                  title="Atalho Rápido"
                  description="Pressione Ctrl duas vezes para abrir o menu de ações instantaneamente."
                />
                <FeatureCard
                  icon={<MousePointer2 className="w-6 h-6 text-purple-500" />}
                  title="Contexto Inteligente"
                  description="Detecta automaticamente a sentença onde seu cursor está posicionado."
                />
                <FeatureCard
                  icon={<Sparkles className="w-6 h-6 text-amber-500" />}
                  title="Powered by Gemini"
                  description="Utiliza o modelo Gemini 1.5 Flash para correções precisas e reescritas naturais."
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-slate-400" />
                  Como instalar a extensão
                </h3>
                
                <ol className="space-y-6">
                  <Step number={1} title="Baixe os arquivos">
                    Os arquivos <code className="bg-slate-100 px-1 rounded">manifest.json</code>, <code className="bg-slate-100 px-1 rounded">content.js</code>, <code className="bg-slate-100 px-1 rounded">background.js</code> e <code className="bg-slate-100 px-1 rounded">styles.css</code> já foram gerados na raiz deste projeto.
                  </Step>
                  <Step number={2} title="Configure sua API Key">
                    Abra o arquivo <code className="bg-slate-100 px-1 rounded">background.js</code> e substitua <code className="text-blue-600">"YOUR_GEMINI_API_KEY"</code> pela sua chave do Google AI Studio.
                  </Step>
                  <Step number={3} title="Acesse as Extensões do Chrome">
                    No Chrome, vá para <code className="bg-slate-100 px-1 rounded">chrome://extensions/</code> e ative o "Modo do desenvolvedor" no canto superior direito.
                  </Step>
                  <Step number={4} title="Carregar extensão expandida">
                    Clique em "Carregar sem compactação" e selecione a pasta onde os arquivos gerados estão localizados.
                  </Step>
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900">Nota de Segurança</h4>
                  <p className="text-amber-800 text-sm">
                    Em uma versão de produção, a API Key não deve ser exposta no código. Recomenda-se criar uma página de opções para que o usuário insira sua própria chave ou utilizar um backend seguro.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Teste o Conceito</h3>
                <p className="text-slate-500">Simule como a extensão funcionaria em um campo de texto.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Campo de Teste</label>
                  <textarea
                    placeholder="Escreva algo com erros aqui... Ex: 'Nós vai na feira amanhã.'"
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                  <Keyboard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    <strong>Dica:</strong> Após instalar a extensão, você poderá clicar neste campo e apertar <strong>Ctrl + Ctrl</strong> para ver a mágica acontecer!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-200 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-400 text-sm">
          Smart Write Companion &copy; 2026 • Desenvolvido com Google Gemini
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-600">
        {number}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-slate-900">{title}</h4>
        <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
