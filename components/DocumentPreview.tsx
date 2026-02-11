
import React from 'react';
import { DocumentData } from '../types.ts';

interface DocumentPreviewProps {
  data: DocumentData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + item.amount, 0);
  const total = subtotal + ((subtotal * data.taxRate) / 100) - data.discount;

  return (
    <div className="document-preview bg-white w-full max-w-[800px] mx-auto shadow-2xl min-h-[1120px] flex flex-col p-16 text-slate-800 border border-slate-100">
      {/* Brand Header */}
      <div className="flex justify-between items-start mb-20">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-2xl">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">{data.agency.name}</h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.3em] font-bold">Financial Studio</p>
            </div>
          </div>
          <div className="text-[13px] text-slate-500 leading-relaxed">
            <p className="font-semibold text-slate-900 mb-1">Company Details</p>
            {data.agency.address.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            <p className="mt-2 text-rose-600 font-medium">{data.agency.email} • {data.agency.website}</p>
            <p className="mt-2 text-[10px] font-mono text-slate-400">REG: {data.agency.registration}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-extralight text-slate-200 uppercase tracking-[0.2em] mb-6 select-none">
            {data.type}
          </h2>
          <div className="space-y-1.5 text-sm">
            <p><span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mr-2">No.</span> <span className="font-bold text-slate-900">#{data.id}</span></p>
            <p><span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mr-2">Date</span> <span className="font-medium">{data.date}</span></p>
            <p><span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest mr-2">Expiry</span> <span className="font-medium">{data.dueDate}</span></p>
          </div>
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-16 grid grid-cols-2">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recipient</h3>
          <div className="text-lg font-bold text-slate-900">{data.client.name}</div>
          <div className="text-[13px] text-slate-500 whitespace-pre-line leading-relaxed mt-1">
            {data.client.address}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="flex-grow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-900">
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left">Service Description</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right w-24">Qty</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right w-32">Rate</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="py-8 pr-8 align-top">
                  <div className="text-sm font-bold text-slate-900 mb-1">{item.title}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed max-w-lg">{item.description}</div>
                </td>
                <td className="py-8 text-[13px] text-right text-slate-500 align-top">{item.quantity}</td>
                <td className="py-8 text-[13px] text-right text-slate-500 align-top">{data.currency} {item.rate.toLocaleString()}</td>
                <td className="py-8 text-[13px] font-bold text-right text-slate-900 align-top">{data.currency} {item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-12 pt-8 border-t-2 border-slate-900 flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-900">{data.currency} {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">Amount Due</span>
            <span className="text-2xl font-black text-rose-600">
              {data.currency} {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Signature */}
      <div className="mt-20">
        <div className="grid grid-cols-5 gap-12">
          <div className="col-span-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Notes & Terms</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              {data.notes}
            </p>
          </div>
          <div className="col-span-2 flex flex-col items-end justify-end">
            <div className="w-full border-b border-slate-300 mb-2"></div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Authorized Representative</p>
            <p className="text-[10px] text-rose-600 font-bold uppercase mt-1">{data.agency.name}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-12 text-center">
        <p className="text-[9px] text-slate-300 uppercase tracking-[0.4em] font-medium">Refined Studio Documents • Kurevi &copy; 2025</p>
      </div>
    </div>
  );
};

export default DocumentPreview;
