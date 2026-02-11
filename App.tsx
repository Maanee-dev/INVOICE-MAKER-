
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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
      { id: '1', title: 'Bespoke Brand Identity', description: 'Architecting a premium visual system including master logo variations and high-end brand guidelines.', quantity: 1, rate: 12500, amount: 12500 },
      { id: '2', title: 'React B2B Flagship Development', description: 'Bespoke enterprise web application built for speed and conversion-heavy purchasing workflows.', quantity: 1, rate: 22000, amount: 22000 },
      { id: '3', title: 'Cinematic Content Production', description: 'High-fidelity video and photography assets for social ecosystem dominance.', quantity: 1, rate: 10500, amount: 10500 },
    ],
    notes: '50% non-refundable deposit required to commence project architecture. Final settlement due upon deployment.',
    taxRate: 0,
    discount: 0,
    currency: 'Rf'
  });

  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleTypeChange = (type: DocumentType) => {
    const currentNumber = docData.id.split('-').pop() || '001';
    const prefix = type === DocumentType.INVOICE ? 'INV' : 'QTN';
    setDocData(prev => ({ ...prev, type, id: `${prefix}-2025-${currentNumber}` }));
  };

  const addItem = () => {
    const newItem: LineItem = { id: Math.random().toString(36).substr(2, 9), title: '', description: '', quantity: 1, rate: 0, amount: 0 };
    setDocData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setDocData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setDocData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') updated.amount = Number(updated.quantity) * Number(updated.rate);
          return updated;
        }
        return item;
      })
    }));
  };

  const handleAiOptimize = async (itemId: string | 'notes') => {
    setIsOptimizing(itemId);
    const text = itemId === 'notes' ? docData.notes : docData.items.find(i => i.id === itemId)?.description || '';
    const optimized = await optimizeDescription(text, itemId === 'notes' ? 'notes' : 'item');
    if (itemId === 'notes') setDocData(prev => ({ ...prev, notes: optimized }));
    else updateItem(itemId, 'description', optimized);
    setIsOptimizing(null);
  };

  const generatePDF = async () => {
    setIsExporting(true);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pages = document.querySelectorAll('.document-page');
    
    try {
      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;
        const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }
      pdf.save(`${docData.type}-${docData.id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f9fafb]">
      {/* Sidebar */}
      <div className="no-print w-full md:w-[450px] lg:w-[550px] bg-white border-r border-slate-200 overflow-y-auto h-screen p-8 custom-scrollbar">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-slate-900" />
            <h1 className="font-bold text-xl tracking-tight uppercase text-slate-900">Kurevi</h1>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-full">
            {[DocumentType.INVOICE, DocumentType.QUOTATION].map(t => (
              <button key={t} onClick={() => handleTypeChange(t)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${docData.type === t ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}>{t}</button>
            ))}
          </div>
        </header>

        <section className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Document Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input value={docData.id} onChange={(e) => setDocData(prev => ({ ...prev, id: e.target.value }))} className="bg-slate-50 border p-2 rounded-lg text-sm" placeholder="Doc ID" />
              <select value={docData.currency} onChange={(e) => setDocData(prev => ({ ...prev, currency: e.target.value }))} className="bg-slate-50 border p-2 rounded-lg text-sm"><option value="Rf">MVR</option><option value="$">USD</option></select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Client</h3>
            <input value={docData.client.name} onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, name: e.target.value } }))} className="w-full bg-slate-50 border p-2 rounded-lg text-sm" placeholder="Client Name" />
            <textarea value={docData.client.address} rows={3} onChange={(e) => setDocData(prev => ({ ...prev, client: { ...prev.client, address: e.target.value } }))} className="w-full bg-slate-50 border p-2 rounded-lg text-sm resize-none" placeholder="Client Address" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Items</h3><button onClick={addItem} className="text-[10px] font-bold text-rose-600">{ICONS.Plus} Add</button></div>
            {docData.items.map(item => (
              <div key={item.id} className="p-4 bg-slate-50 border rounded-xl space-y-3 relative group">
                <input value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} className="w-full bg-white border p-2 rounded text-sm font-bold" placeholder="Service" />
                <div className="relative">
                  <textarea value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full bg-white border p-2 rounded text-[11px] resize-none" rows={3} placeholder="Desc" />
                  <button onClick={() => handleAiOptimize(item.id)} className="absolute right-2 top-2 text-rose-500">{isOptimizing === item.id ? '...' : ICONS.AI}</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="bg-white border p-2 rounded text-xs" placeholder="Rate" />
                  <div className="text-right text-xs font-bold self-center">{docData.currency} {item.amount.toLocaleString()}</div>
                </div>
                <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-white border rounded-full p-1 text-rose-500">{ICONS.Trash}</button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Terms</h3>
            <textarea value={docData.notes} rows={4} onChange={e => setDocData(prev => ({ ...prev, notes: e.target.value }))} className="w-full bg-slate-50 border p-2 rounded-lg text-xs" />
          </div>
        </section>

        <footer className="mt-12">
          <button 
            onClick={generatePDF} 
            disabled={isExporting}
            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase text-xs ${isExporting ? 'bg-slate-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'}`}
          >
            {isExporting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Compiling Studio PDF...</>
            ) : (
              <>{ICONS.Send} Export Multi-Page PDF</>
            )}
          </button>
        </footer>
      </div>

      {/* Preview */}
      <main className="flex-grow h-screen overflow-y-auto bg-slate-100 p-8 flex flex-col items-center custom-scrollbar">
        <DocumentPreview data={docData} />
      </main>
    </div>
  );
};

export default App;
