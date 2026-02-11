
import React from 'react';
import { DocumentData, LineItem } from '../types.ts';
import { Logo } from '../constants.tsx';

interface DocumentPreviewProps {
  data: DocumentData;
}

const Page: React.FC<{ children: React.ReactNode; pageNumber: number; totalPages: number }> = ({ children, pageNumber, totalPages }) => (
  <div className="document-page relative bg-white w-full max-w-[800px] mx-auto shadow-2xl min-h-[1120px] flex flex-col p-16 text-slate-800 border border-slate-100 mb-10 last:mb-0 overflow-hidden" style={{ height: '1120px' }}>
    {children}
    <div className="absolute bottom-8 left-0 right-0 text-center no-print">
      <span className="text-[9px] text-slate-300 uppercase tracking-[0.3em] font-bold">Page {pageNumber} of {totalPages}</span>
    </div>
  </div>
);

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + item.amount, 0);
  const total = subtotal + ((subtotal * data.taxRate) / 100) - data.discount;

  // Split items into chunks for multi-page support
  // Page 1 gets fewer items due to large header/client info
  const itemsPerPageFirst = 2;
  const itemsPerPageSubsequent = 3;
  
  const pages: LineItem[][] = [];
  let currentItemIndex = 0;

  // Page 1
  pages.push(data.items.slice(0, itemsPerPageFirst));
  currentItemIndex = itemsPerPageFirst;

  // Remaining pages
  while (currentItemIndex < data.items.length) {
    pages.push(data.items.slice(currentItemIndex, currentItemIndex + itemsPerPageSubsequent));
    currentItemIndex += itemsPerPageSubsequent;
  }

  const totalPagesCount = pages.length + 1; // +1 for the Summary/Terms page

  return (
    <div className="preview-container w-full py-10">
      {/* Page 1: Brand & Initial Items */}
      <Page pageNumber={1} totalPages={totalPagesCount}>
        <div className="flex justify-between items-start mb-16">
          <div>
            <div className="mb-10">
              <Logo className="w-20 h-20 text-slate-900" />
            </div>
            <div className="text-[12px] text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-2">Agency Headquarters</p>
              <p className="font-bold text-slate-900 text-sm mb-0.5">{data.agency.name}</p>
              {data.agency.address.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              <p className="mt-2 text-rose-600 font-medium">{data.agency.email} • {data.agency.website}</p>
              <p className="mt-1 text-[9px] font-mono text-slate-400">REG: {data.agency.registration}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-5xl font-extralight text-slate-100 uppercase tracking-[0.2em] mb-6 select-none">
              {data.type}
            </h2>
            <div className="space-y-1 text-sm">
              <p><span className="text-slate-400 uppercase text-[9px] font-bold tracking-widest mr-2">Reference</span> <span className="font-bold text-slate-900">#{data.id}</span></p>
              <p><span className="text-slate-400 uppercase text-[9px] font-bold tracking-widest mr-2">Issue Date</span> <span className="font-medium">{data.date}</span></p>
              <p><span className="text-slate-400 uppercase text-[9px] font-bold tracking-widest mr-2">Valid Until</span> <span className="font-medium">{data.dueDate}</span></p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Project Recipient</h3>
          <div className="text-md font-bold text-slate-900">{data.client.name}</div>
          <div className="text-[12px] text-slate-500 whitespace-pre-line leading-relaxed mt-1">
            {data.client.address}
          </div>
        </div>

        <div className="flex-grow">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-left">Service Specification</th>
                <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right w-24">Rate</th>
                <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages[0].map((item) => (
                <tr key={item.id}>
                  <td className="py-6 pr-8 align-top">
                    <div className="text-[13px] font-bold text-slate-900 mb-1.5 uppercase tracking-tight">{item.title}</div>
                    <div className="text-[11px] text-slate-500 leading-relaxed max-w-lg">{item.description}</div>
                  </td>
                  <td className="py-6 text-[12px] text-right text-slate-500 align-top">{data.currency} {item.rate.toLocaleString()}</td>
                  <td className="py-6 text-[12px] font-bold text-right text-slate-900 align-top">{data.currency} {item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Page>

      {/* Subsequent Item Pages */}
      {pages.slice(1).map((chunk, pageIdx) => (
        <Page key={pageIdx} pageNumber={pageIdx + 2} totalPages={totalPagesCount}>
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 text-slate-900" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.agency.name}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">#{data.id} / CONTINUED</span>
          </div>
          
          <div className="flex-grow">
            <table className="w-full">
              <tbody className="divide-y divide-slate-100">
                {chunk.map((item) => (
                  <tr key={item.id}>
                    <td className="py-8 pr-8 align-top">
                      <div className="text-[13px] font-bold text-slate-900 mb-1.5 uppercase tracking-tight">{item.title}</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed max-w-lg">{item.description}</div>
                    </td>
                    <td className="py-8 text-[12px] text-right text-slate-500 align-top w-24">{data.currency} {item.rate.toLocaleString()}</td>
                    <td className="py-8 text-[12px] font-bold text-right text-slate-900 align-top w-32">{data.currency} {item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Page>
      ))}

      {/* Final Summary & Terms Page */}
      <Page pageNumber={totalPagesCount} totalPages={totalPagesCount}>
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-slate-900" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.agency.name}</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">#{data.id} / FINAL SUMMARY</span>
        </div>

        <div className="mb-12">
          <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6 border-b-2 border-slate-900 pb-2 inline-block">Financial Breakdown</h4>
          <div className="space-y-4 max-w-md ml-auto">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>Gross Subtotal</span>
              <span className="text-slate-900">{data.currency} {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>Standard Tax (0%)</span>
              <span className="text-slate-900">{data.currency} 0.00</span>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Total Investment Due</span>
                <span className="text-3xl font-black text-rose-600">
                  {data.currency} {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mandatory Notes & Project Terms</h4>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
              {data.notes}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-20">
          <div className="flex flex-col justify-end">
            <div className="w-full border-b border-slate-300 mb-3"></div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Authorized Signature</p>
            <p className="text-[10px] text-slate-900 font-bold uppercase mt-1">{data.agency.name} Management</p>
          </div>
          <div className="flex flex-col justify-end items-end">
             <div className="text-right">
                <p className="text-[9px] text-slate-300 uppercase tracking-[0.4em] font-medium mb-1">Generated by Kurevi Finance Studio</p>
                <p className="text-[8px] text-slate-200 uppercase tracking-[0.2em]">DOCUMENT ID: {data.id}-{new Date().getTime().toString(16)}</p>
             </div>
          </div>
        </div>
      </Page>
    </div>
  );
};

export default DocumentPreview;
