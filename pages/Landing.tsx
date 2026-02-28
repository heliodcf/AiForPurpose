import React from 'react';
import { Layout } from '../components/Layout';
import { AgentWidget } from '../components/AgentWidget';
import { IconCheckCircle } from '../components/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { openAgent } = useRouter();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/8/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-brand-600 bg-brand-50 mb-8 border border-brand-100">
            <span className="flex h-2 w-2 rounded-full bg-brand-600 mr-2"></span>
            {t('hero.badge')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
            {t('hero.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">{t('hero.titleHighlight')}</span>
          </h1>
          
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => openAgent()}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg hover:bg-brand-600 transition-colors shadow-xl shadow-brand-500/20"
            >
              {t('hero.btnQuote')}
            </button>
            <button 
              onClick={() => openAgent()}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-lg hover:bg-slate-50 transition-colors"
            >
              {t('hero.btnCases')}
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">{t('hero.hint')}</p>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-20 bg-slate-50" id="solucoes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-10">
            
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('val.time.title')}</h3>
              <p className="text-slate-600">{t('val.time.desc')}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('val.conv.title')}</h3>
              <p className="text-slate-600">{t('val.conv.desc')}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('val.247.title')}</h3>
              <p className="text-slate-600">{t('val.247.desc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('srv.title')}</h2>
            <p className="mt-4 text-lg text-slate-600">{t('srv.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Service 1 */}
            <div className="flex flex-col justify-center">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('srv.msg.title')}</h3>
              <p className="text-slate-600 mb-6">
                {t('srv.msg.desc')}
              </p>
              <ul className="space-y-3">
                {[t('srv.msg.f1'), t('srv.msg.f2'), t('srv.msg.f3')].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <IconCheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 rounded-3xl p-8 relative overflow-hidden group flex items-center justify-center">
              <img 
                src="https://xrslfoismvmvbaeendfg.supabase.co/storage/v1/object/public/Images/Ai%20Image1.png" 
                alt="Messaging Agents" 
                className="w-full h-auto max-w-md rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
            </div>

            {/* Service 2 */}
            <div className="bg-slate-100 rounded-3xl p-8 relative overflow-hidden group order-2 md:order-1 flex items-center justify-center">
               <img 
                 src="https://xrslfoismvmvbaeendfg.supabase.co/storage/v1/object/public/Images/AiImage2.png" 
                 alt="Voice Agents" 
                 className="w-full h-auto max-w-md rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                 referrerPolicy="no-referrer" 
               />
            </div>
            <div className="flex flex-col justify-center order-1 md:order-2">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('srv.voice.title')}</h3>
              <p className="text-slate-600 mb-6">
                {t('srv.voice.desc')}
              </p>
              <ul className="space-y-3">
                {[t('srv.voice.f1'), t('srv.voice.f2'), t('srv.voice.f3')].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <IconCheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-900 text-white" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">{t('hiw.title')}</h2>
            <p className="mt-4 text-lg text-slate-400">{t('hiw.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h4 className="text-xl font-bold mb-3">{t('hiw.s1.title')}</h4>
              <p className="text-slate-400">{t('hiw.s1.desc')}</p>
            </div>
            <div className="text-center relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h4 className="text-xl font-bold mb-3">{t('hiw.s2.title')}</h4>
              <p className="text-slate-400">{t('hiw.s2.desc')}</p>
            </div>
            <div className="text-center relative">
               <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h4 className="text-xl font-bold mb-3">{t('hiw.s3.title')}</h4>
              <p className="text-slate-400">{t('hiw.s3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-50" id="planos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('prc.title')}</h2>
            <p className="mt-4 text-lg text-slate-600">{t('prc.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">{t('prc.st.title')}</h3>
              <p className="text-slate-500 text-sm mt-2">{t('prc.st.desc')}</p>
              <div className="mt-6 text-3xl font-extrabold text-slate-900 mb-6">{t('prc.ent.custom')}</div>
              <ul className="space-y-4 mb-8">
                <li className="flex text-slate-600"><IconCheckCircle className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" /> {t('prc.st.f1')}</li>
                <li className="flex text-slate-600"><IconCheckCircle className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" /> {t('prc.st.f2')}</li>
                <li className="flex text-slate-600"><IconCheckCircle className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" /> {t('prc.st.f3')}</li>
              </ul>
              <button onClick={() => openAgent()} className="w-full py-3 px-4 bg-brand-50 text-brand-700 font-semibold rounded-xl hover:bg-brand-100 transition-colors">{t('prc.st.btn')}</button>
            </div>

            {/* Growth */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-brand-500 shadow-xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{t('prc.gr.badge')}</div>
              <h3 className="text-xl font-bold text-white">{t('prc.gr.title')}</h3>
              <p className="text-slate-400 text-sm mt-2">{t('prc.gr.desc')}</p>
              <div className="mt-6 text-3xl font-extrabold text-white mb-6">{t('prc.ent.custom')}</div>
              <ul className="space-y-4 mb-8">
                <li className="flex text-slate-300"><IconCheckCircle className="w-5 h-5 text-brand-400 mr-2 flex-shrink-0" /> {t('prc.gr.f1')}</li>
                <li className="flex text-slate-300"><IconCheckCircle className="w-5 h-5 text-brand-400 mr-2 flex-shrink-0" /> {t('prc.gr.f2')}</li>
                <li className="flex text-slate-300"><IconCheckCircle className="w-5 h-5 text-brand-400 mr-2 flex-shrink-0" /> {t('prc.gr.f3')}</li>
              </ul>
              <button onClick={() => openAgent()} className="w-full py-3 px-4 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors">{t('prc.gr.btn')}</button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">{t('prc.ent.title')}</h3>
              <p className="text-slate-500 text-sm mt-2">{t('prc.ent.desc')}</p>
              <div className="mt-6 text-3xl font-extrabold text-slate-900 mb-6">{t('prc.ent.custom')}</div>
              <ul className="space-y-4 mb-8">
                <li className="flex text-slate-600"><IconCheckCircle className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" /> {t('prc.ent.f1')}</li>
                <li className="flex text-slate-600"><IconCheckCircle className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" /> {t('prc.ent.f2')}</li>
                <li className="flex text-slate-600"><IconCheckCircle className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" /> {t('prc.ent.f3')}</li>
              </ul>
              <button onClick={() => openAgent()} className="w-full py-3 px-4 bg-brand-50 text-brand-700 font-semibold rounded-xl hover:bg-brand-100 transition-colors">{t('prc.ent.btn')}</button>
            </div>
          </div>
        </div>
      </section>

      <AgentWidget />
    </Layout>
  );
};
