
import React, { useState, useEffect, useCallback } from 'react';
import { 
  DocumentData, 
  DocumentType, 
  LineItem, 
  ClientInfo 
} from './types';
import { 
  ICONS, 
  DEFAULT_AGENCY 
} from './constants';
import DocumentPreview from './components/DocumentPreview';
import { optimizeDescription } from './services/geminiService';

const App: React.FC = () => {
  const [docData, setDocData] = useState<DocumentData>({
    id: 'INV-2025-001',
    type: DocumentType.INVOICE,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    client: {
      name: 'Visionary Tech Corp',
      email: 'finance@visionary.tech',
      address: '789 Innovation Drive\nSan Francisco, CA 94105',
      taxId: 'TX-9988-77'
    },
    agency: DEFAULT_AGENCY,
    items: [
      { 
        id: '1', 
        title: 'Brand Strategy & Identity', 
        description: 'Comprehensive visual direction, logo suite, and brand guidelines for market positioning.', 
        quantity: 1, 
        rate: 45000, 
        amount: 45000 
      },
      { 
        id: '2', 
        title: 'Social Media Management', 
        description: 'Monthly content creation, scheduling, and community engagement across all major platforms.', 
        quantity: 1, 
        rate: 25000, 
        amount: 25000 
      },
    ],
    notes: 'Payment is due within 14 days. Please include the invoice number in your bank transfer.',
    taxRate: 0,
    discount: 0,
    currency: 'Rf'
  });

  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);

  const handleTypeChange = (type: DocumentType) => {
    const currentNumber = docData.id.split('-').pop() || '001';
    const newId = type === DocumentType.INVOICE ? `INV-2025-${currentNumber}` : `QTN-2025-${currentNumber}`;
    const newCurrency = 'Rf';
    
    setDocData(prev => ({ 
      ...prev, 
      type, 
      id: newId,
      currency: newCurrency
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">K</span>
              </div>
              <h1 className="font-bold text-xl tracking-tight uppercase text-slate-900">Kurevi</h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleTypeChange(DocumentType.INVOICE)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${docData.type === DocumentType.INVOICE ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                INVOICE
              </button>
              <button 
                onClick={() => handleTypeChange(DocumentType.QUOTATION)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${docData.type === DocumentType.QUOTATION ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                QUOTATION
              </button>
            </div>
          </div>
          <div className="border-l-4 border-rose-600 pl-4 py-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Financial Studio</h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Create world-class professional billing documents with AI-enhanced descriptions for KUREVII STUDIO projects.
            </p>
          </div>
        </header>

        <section className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">General Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Document #</label>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="Rf">MVR (Rf)</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
                <input 
                  type="date"
                  value={docData.date}
                  onChange={(e) => setDocData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Due Date</label>
                <input 
                  type="date"
                  value={docData.dueDate}
                  onChange={(e) => setDocData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" 
                />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Details</h3>
            <div className="space-y-3">
              <input 
                placeholder="Client Name"
                value={docData.client.name}
                onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, name: e.target.value } }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" 
              />
              <input 
                type="email"
                placeholder="Client Email"
                value={docData.client.email}
                onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, email: e.target.value } }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" 
              />
              <textarea 
                placeholder="Client Address"
                value={docData.client.address}
                rows={3}
                onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, address: e.target.value } }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none" 
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Services</h3>
              <button 
                onClick={addItem}
                className="text-xs font-bold text-rose-600 flex items-center gap-1 hover:text-rose-700 transition-colors"
              >
                {ICONS.Plus} Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {docData.items.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 group relative">
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Headline</label>
                      <input 
                        placeholder="Service Title (e.g. Brand Strategy)"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20" 
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                      <textarea 
                        rows={2}
                        placeholder="Details of the service provided..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none" 
                      />
                      <button 
                        onClick={() => handleAiOptimize(item.id)}
                        disabled={isOptimizing === item.id}
                        className="absolute right-2 top-6 p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
                        title="Optimize with AI"
                      >
                        {isOptimizing === item.id ? (
                          <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : ICONS.AI}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/60">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Qty</label>
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rate</label>
                      <input 
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm" 
                      />
                    </div>
                    <div className="flex flex-col justify-end items-end pr-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total</label>
                      <div className="text-sm font-semibold text-slate-700">{docData.currency} {item.amount.toLocaleString()}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {ICONS.Trash}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tax (%)</label>
                <input 
                  type="number"
                  value={docData.taxRate}
                  onChange={(e) => setDocData(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Discount Amount</label>
                <input 
                  type="number"
                  value={docData.discount}
                  onChange={(e) => setDocData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" 
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Professional Notes</label>
              <textarea 
                rows={3}
                value={docData.notes}
                onChange={(e) => setDocData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none" 
              />
              <button 
                onClick={() => handleAiOptimize('notes')}
                disabled={isOptimizing === 'notes'}
                className="absolute right-2 bottom-3 p-1 text-rose-500 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
              >
                {isOptimizing === 'notes' ? (
                  <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                ) : ICONS.AI}
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-12 space-y-3">
          <button 
            onClick={printDocument}
            className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {ICONS.Print} Export as PDF
          </button>
          <button className="w-full border border-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
            {ICONS.Send} Send to Client
          </button>
        </footer>
      </div>

      {/* Main Preview Area */}
      <main className="flex-grow h-screen overflow-y-auto bg-slate-100 p-4 md:p-8 flex flex-col items-center custom-scrollbar">
        <div className="no-print w-full max-w-[800px] mb-6 flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
          </div>
          <div className="text-xs">World-class minimalist rendering active</div>
        </div>
        <DocumentPreview data={docData} />
      </main>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 no-print w-[90%]">
        <button 
          onClick={printDocument}
          className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-rose-600/40 flex items-center justify-center gap-3"
        >
          {ICONS.Download} Save PDF
        </button>
      </div>
    </div>
  );
};

export default App;
