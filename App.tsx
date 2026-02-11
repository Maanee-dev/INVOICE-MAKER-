
import React, { useState } from 'react';
import { 
  DocumentData, 
  DocumentType, 
  LineItem 
} from './types.ts';
import { 
  ICONS, 
  DEFAULT_AGENCY,
  Logo
} from './constants.tsx';
import DocumentPreview from './components/DocumentPreview.tsx';
import { optimizeDescription } from './services/geminiService.ts';

const App: React.FC = () => {
  const [docData, setDocData] = useState<DocumentData>({
    id: 'QTN-2025-084',
    type: DocumentType.QUOTATION,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    client: {
      name: 'MALDIVES TUNA HOT SAUCE COMPANY. PT LTD.',
      email: 'xaan605@gmail.com, abdullaluthufi@gmail.com',
      address: 'HITHADOO S EVERGREEN\nADDOO CITY: 19029\nMALDIVES\n+9607848504, +66 943718504',
      taxId: ''
    },
    agency: DEFAULT_AGENCY,
    items: [
      { 
        id: 'p1-1', 
        title: 'Phase 1: Bespoke Brand Identity Architecture', 
        description: 'A deep-dive creative exercise encompassing market positioning, competitor analysis, and visual language development. Deliverables include a master logo system (primary, secondary, and mark variants), custom color theory palettes designed for the premium hospitality sector, bespoke typography hierarchies, and a 40-page Brand Bible outlining rigorous digital and physical application standards.', 
        quantity: 1, 
        rate: 12500, 
        amount: 12500 
      },
      { 
        id: 'p1-2', 
        title: 'Phase 1: Narrative Product Architecture & Tagging', 
        description: 'Translating brand values into tangible product elements. Development of a unique die-cut physical tag system utilizing premium materials. Includes strategic narrative copywriting for product story and the integration of dynamic QR codes that trigger immersive digital storytelling experiences upon customer interaction.', 
        quantity: 1, 
        rate: 5500, 
        amount: 5500 
      },
      { 
        id: 'p1-3', 
        title: 'Phase 1: Industrial Master-Layout Packaging', 
        description: 'Advanced engineering of product packaging aesthetics across your entire SKU lineup. This involves structural layout design for pouches, glass, or boxes, ensuring print-ready precision, high-end finishing specifications (embossing/UV spot), and a unified luxury shelf presence that commands attention in boutique retail environments.', 
        quantity: 1, 
        rate: 3500, 
        amount: 3500 
      },
      { 
        id: 'p2-1', 
        title: 'Phase 2: High-Performance Custom React B2B Flagship', 
        description: 'Engineering of a bespoke, enterprise-grade web application built from the ground up using a modern React.js framework. Unlike standard templates, this custom architecture provides ultra-fast "edge-case" performance, SEO-friendly server-side rendering, and a proprietary procurement portal designed specifically to convert high-value resort purchasing managers into loyal partners.', 
        quantity: 1, 
        rate: 22000, 
        amount: 22000 
      },
      { 
        id: 'p2-2', 
        title: 'Phase 2: Proprietary Digital Traceability System', 
        description: 'Implementation of a specialized, secure digital ledger within your React application. This allows end-consumers and B2B buyers to verify "Ocean-to-Plate" batch data, certifications, and quality metrics in real-time, positioning your brand as the gold standard for transparency in the Maldives gourmet sector.', 
        quantity: 1, 
        rate: 6500, 
        amount: 6500 
      },
      { 
        id: 'p2-3', 
        title: 'Phase 2: Strategic Copywriting & Authority SEO', 
        description: 'Development of high-authority web copy that blends conversion-psychology with your brand story. Technical SEO implementation focuses on local and international keyword dominance for "Premium Maldives Exports" and "Resort Gourmet Supply," ensuring your platform becomes an organic lead-generation engine.', 
        quantity: 1, 
        rate: 4500, 
        amount: 4500 
      },
      { 
        id: 'p3-1', 
        title: 'Phase 3: Omnichannel Social Ecosystem Management (Monthly)', 
        description: 'Complete strategic management of Instagram, LinkedIn, and Facebook. Includes content calendar planning, daily community engagement to build brand loyalty, active reputation management for B2B queries, and data-driven monthly strategy pivots to maximize organic reach and brand authority.', 
        quantity: 1, 
        rate: 10000, 
        amount: 10000 
      },
      { 
        id: 'p3-2', 
        title: 'Phase 3: Cinematic Content Production Suite (Monthly)', 
        description: 'Bi-weekly high-fidelity visual production. Includes specialized macro food photography, cinemagraphs, and high-energy short-form video content (Reels/TikTok) produced with professional lighting and audio. This ensures a constant stream of premium assets that reflect your brand\'s high-end market position.', 
        quantity: 1, 
        rate: 10500, 
        amount: 10500 
      },
      { 
        id: 'p3-3', 
        title: 'Phase 3: B2B Growth & Partnership Outreach (Monthly)', 
        description: 'An active "Boots on the Ground" digital outreach strategy. We manage direct executive communication with Resort F&B Directors and Purchasing Managers via targeted LinkedIn campaigns and personalized email sequences, specifically designed to secure long-term bulk supply contracts for your product lines.', 
        quantity: 1, 
        rate: 5500, 
        amount: 5500 
      },
      { 
        id: 'p3-4', 
        title: 'Phase 3: Performance Marketing & Data Intelligence (Monthly)', 
        description: 'Precision management of Meta and Google ad spend. We utilize advanced pixel tracking, lookalike audience modeling, and multi-variant A/B testing to ensure every cent of your ad spend is optimized for lead generation. Monthly transparency reports provide deep insights into ROI and customer acquisition costs.', 
        quantity: 1, 
        rate: 4000, 
        amount: 4000 
      },
    ],
    notes: 'Project Milestones & Critical Financial Terms:\n\n1. PROJECT COMMENCEMENT (Phases 1 & 2): MVR 54,500.00 Total\n   - NON-NEGOTIABLE DEPOSIT: A non-refundable 50% deposit (MVR 27,250.00) of the combined Phase 1 and Phase 2 total is strictly required prior to the commencement of any creative design or custom code development. This secures your studio slot and covers initial research/resource allocation.\n   - FINAL SETTLEMENT: The remaining 50% balance is due upon successful final handover of all brand assets and the deployment of the custom React application to the production server.\n\n2. RECURRING GROWTH RETAINER (Phase 3 Total): MVR 30,000.00 / Month\n   - Monthly service fees are billed in full on the 1st of each calendar month. Payments must be settled within 5 business days to ensure uninterrupted content production and outreach activities.\n\nEXCLUSIVE PARTNERSHIP OFFER: By committing to a minimum 12-month Phase 3 Retainer agreement, Kurevi will apply a 20% loyalty deduction to your Phase 1 & 2 setup fees, effectively reducing your initial capital outlay.',
    taxRate: 0,
    discount: 0,
    currency: 'Rf'
  });

  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);

  const handleTypeChange = (type: DocumentType) => {
    const currentNumber = docData.id.split('-').pop() || '001';
    const prefix = type === DocumentType.INVOICE ? 'INV' : 'QTN';
    const newId = `${prefix}-2025-${currentNumber}`;
    
    setDocData(prev => ({ 
      ...prev, 
      type, 
      id: newId
    }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setDocData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setDocData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setDocData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleAiOptimize = async (itemId: string | 'notes') => {
    setIsOptimizing(itemId);
    const textToOptimize = itemId === 'notes' 
      ? docData.notes 
      : docData.items.find(i => i.id === itemId)?.description || '';
    
    const optimizedText = await optimizeDescription(textToOptimize, itemId === 'notes' ? 'notes' : 'item');
    
    if (itemId === 'notes') {
      setDocData(prev => ({ ...prev, notes: optimizedText }));
    } else {
      updateItem(itemId, 'description', optimizedText);
    }
    setIsOptimizing(null);
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f9fafb]">
      {/* Sidebar - Controls */}
      <div className="no-print w-full md:w-[450px] lg:w-[550px] bg-white border-r border-slate-200 overflow-y-auto h-screen p-8 custom-scrollbar">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8 text-slate-900" />
              <h1 className="font-bold text-xl tracking-tight uppercase text-slate-900">Kurevi</h1>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-full">
              <button 
                onClick={() => handleTypeChange(DocumentType.INVOICE)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${docData.type === DocumentType.INVOICE ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                INVOICE
              </button>
              <button 
                onClick={() => handleTypeChange(DocumentType.QUOTATION)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${docData.type === DocumentType.QUOTATION ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                QUOTATION
              </button>
            </div>
          </div>
          <div className="border-l-4 border-slate-900 pl-4 py-1">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Financial Studio</h2>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Generate refined billing documents for KUREVII PVT LTD projects.
            </p>
          </div>
        </header>

        <section className="space-y-8">
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Document Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Doc Number</label>
                <input 
                  value={docData.id}
                  onChange={(e) => setDocData(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Currency</label>
                <select 
                  value={docData.currency}
                  onChange={(e) => setDocData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="Rf">MVR (Rf)</option>
                  <option value="$">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Client Information</h3>
            <div className="space-y-3">
              <input 
                placeholder="Client Business Name"
                value={docData.client.name}
                onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, name: e.target.value } }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" 
              />
              <textarea 
                placeholder="Full Address, Phones"
                value={docData.client.address}
                rows={5}
                onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, address: e.target.value } }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" 
              />
              <input 
                placeholder="Client Emails"
                value={docData.client.email}
                onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, email: e.target.value } }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" 
              />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Line Items</h3>
              <button onClick={addItem} className="text-[10px] font-bold text-rose-600 flex items-center gap-1 uppercase">
                {ICONS.Plus} Add Service
              </button>
            </div>
            
            <div className="space-y-4">
              {docData.items.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 group relative">
                  <div className="space-y-3">
                    <input 
                      placeholder="Service Headline"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" 
                    />
                    <div className="relative">
                      <textarea 
                        rows={5}
                        placeholder="Detailed service description..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-[11px] leading-relaxed resize-none" 
                      />
                      <button 
                        onClick={() => handleAiOptimize(item.id)}
                        disabled={isOptimizing === item.id}
                        className="absolute right-2 top-2 p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        {isOptimizing === item.id ? (
                          <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : ICONS.AI}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-200/60">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Qty</label>
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Rate</label>
                      <input 
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs" 
                      />
                    </div>
                    <div className="text-right flex flex-col justify-end pb-1">
                      <div className="text-[10px] font-bold text-slate-700">{docData.currency} {item.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-slate-300 hover:text-rose-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                    {ICONS.Trash}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Notes & Terms</h3>
            <div className="relative">
              <textarea 
                placeholder="Additional notes, payment terms, or summary..."
                value={docData.notes}
                rows={12}
                onChange={(e) => setDocData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs leading-relaxed resize-none" 
              />
              <button 
                onClick={() => handleAiOptimize('notes')}
                disabled={isOptimizing === 'notes'}
                className="absolute right-2 top-2 p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
              >
                {isOptimizing === 'notes' ? (
                  <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                ) : ICONS.AI}
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-12 space-y-3">
          <button 
            onClick={printDocument}
            className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            {ICONS.Print} Export Premium PDF
          </button>
        </footer>
      </div>

      {/* Preview Area */}
      <main className="flex-grow h-screen overflow-y-auto bg-slate-100 p-8 flex flex-col items-center custom-scrollbar">
        <div className="no-print w-full max-w-[800px] mb-6 flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Document Master Preview</span>
          </div>
        </div>
        <DocumentPreview data={docData} />
      </main>
    </div>
  );
};

export default App;
