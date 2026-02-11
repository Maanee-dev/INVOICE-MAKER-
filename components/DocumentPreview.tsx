
import React from 'react';
import { DocumentData, DocumentType } from '../types';

interface DocumentPreviewProps {
  data: DocumentData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + item.amount, 0);
  const taxAmount = (subtotal * data.taxRate) / 100;
  const total = subtotal + taxAmount - data.discount;

  return (
    <div className="document-preview bg-white w-full max-w-[800px] mx-auto shadow-2xl min-h-[1100px] flex flex-col p-12 md:p-16 text-slate-800 border border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase leading-none">{data.agency.name}</h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">Creative Studio</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
            {data.agency.address}
            <br />
            {data.agency.email}
            <br />
            {data.agency.website}
            {data.agency.registration && (
              <div className="mt-2 text-[10px] text-slate-400 font-mono uppercase border-t border-slate-100 pt-2">
                Reg: {data.agency.registration}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-light text-rose-600 uppercase tracking-widest mb-4">
            {data.type}
          </h2>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-400">Number:</span> <span className="font-semibold text-slate-800">#{data.id}</span></p>
            <p><span className="text-slate-400">Date:</span> <span className="font-semibold text-slate-800">{data.date}</span></p>
            <p><span className="text-slate-400">Due Date:</span> <span className="font-semibold text-slate-800">{data.dueDate}</span></p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-12">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Client</h3>
        <div className="text-base font-semibold text-slate-900">{data.client.name}</div>
        <div className="text-sm text-slate-500 whitespace-pre-line leading-relaxed max-w-xs mt-1">
          {data.client.email && <div className="font-medium text-slate-700">{data.client.email}</div>}
          {data.client.address}
          {data.client.taxId && <div className="mt-1">Tax ID: {data.client.taxId}</div>}
        </div>
      </div>

      {/* Items Table */}
      <div className="flex-grow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Description</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-center w-20">Qty</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right w-32">Rate</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="py-6 pr-4">
                  <div className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed max-w-md">{item.description}</div>
                </td>
                <td className="py-6 text-sm text-center text-slate-500">{item.quantity}</td>
                <td className="py-6 text-sm text-right text-slate-500">{data.currency} {item.rate.toLocaleString()}</td>
                <td className="py-6 text-sm font-semibold text-right text-slate-900">{data.currency} {item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-12 flex justify-end">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-900 font-medium">{data.currency} {subtotal.toLocaleString()}</span>
          </div>
          {data.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax ({data.taxRate}%)</span>
              <span className="text-slate-900 font-medium">{data.currency} {taxAmount.toLocaleString()}</span>
            </div>
          )}
          {data.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Discount</span>
              <span className="text-rose-600 font-medium">-{data.currency} {data.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-4 mt-2 flex justify-between items-center">
            <span className="text-base font-bold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-bold text-rose-600">
              {data.currency} {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Notes */}
      <div className="mt-20 border-t border-slate-100 pt-10">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Notes & Terms</h4>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              {data.notes || "Thank you for choosing Kurevi. We appreciate your business and look forward to our continued partnership."}
            </p>
          </div>
          <div className="flex flex-col items-end justify-end text-right">
            <div className="w-48 h-px bg-slate-300 mb-4"></div>
            <p className="text-xs text-slate-400 uppercase tracking-widest">Authorized Signature</p>
            <p className="text-[10px] text-slate-900 font-bold mt-1 uppercase">{data.agency.name}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em]">{data.agency.name} &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default DocumentPreview;
