
import React from 'react';
import { 
  FileText, 
  CreditCard, 
  Plus, 
  Trash2, 
  Printer, 
  Sparkles,
  Send
} from 'lucide-react';

export const ICONS = {
  Invoice: <FileText className="w-4 h-4" />,
  Quotation: <CreditCard className="w-4 h-4" />,
  Plus: <Plus className="w-4 h-4" />,
  Trash: <Trash2 className="w-4 h-4" />,
  Print: <Printer className="w-4 h-4" />,
  AI: <Sparkles className="w-3.5 h-3.5" />,
  Send: <Send className="w-4 h-4" />,
};

export const DEFAULT_AGENCY = {
  name: 'KUREVII STUDIO PVT LTD',
  email: 'hello@kurevi.com',
  address: 'VINARES V01 A 11 03\nVinares Tower 1 A, 2300\nK. Hulhumale\', Maldives',
  website: 'www.kurevi.com',
  phone: '+960 777-0000',
  registration: 'C13882025 / 2025PV01246E'
};
