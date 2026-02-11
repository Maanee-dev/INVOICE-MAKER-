
import React, { useState } from 'react';
import { 
  DocumentData, 
  DocumentType, 
  LineItem 
} from './types';
import { 
  ICONS, 
  DEFAULT_AGENCY 
} from './constants';
import DocumentPreview from './components/DocumentPreview';
import { optimizeDescription } from './services/geminiService';

const App: React.FC = () => {
  const [docData, setDocData] = useState<DocumentData>({
    id: 'QTN-2025-001',
    type: DocumentType.QUOTATION,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    client: {
      name: 'Visionary Partner Ltd',
      email: 'hello@client.com',
      address: 'Male\', Maldives',
      taxId: ''
    },
    agency: DEFAULT_AGENCY,
    items: [
      { 
        id: '1', 
        title: 'Brand Strategy & Identity', 
        description: 'Comprehensive visual direction, logo suite, and brand guidelines for market positioning.', 
        quantity: 1, 
        rate: 15000, 
        amount: 15000 
      },
    ],
    notes: 'Validity: This quotation is valid for 30 days from the date of issue.',
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
      <div className="no-print w-full md:w-[450px] lg:w-[500px] bg-white border-r border-slate-200 overflow-y-auto h-screen p-8 custom-scrollbar">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-600 rounded flex items-center justify-center shadow-lg shadow-rose-600/20">
                <span className="text-white font-black text-sm">K</span>
              </div>
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
          <div className="border-l-4 border-rose-600 pl-4 py-1">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Financial Studio</h2>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Generate refined billing documents for KUREVII STUDIO projects.
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
                placeholder="Full Address"
                value={docData.client.address}
                rows={2}
                onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, address: e.target.value } }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" 
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
                        rows={2}
                        placeholder="Detailed service description..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs leading-relaxed resize-none" 
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
