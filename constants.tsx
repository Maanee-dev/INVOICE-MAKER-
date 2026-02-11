
import React from 'react';
import { 
  FileText, 
  CreditCard, 
  Users, 
  Settings, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Send
} from 'lucide-react';

export const COLORS = {
  primary: '#E11D48', // Tailwind rose-600
  secondary: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};

export const ICONS = {
  Invoice: <FileText className="w-5 h-5" />,
  Quotation: <CreditCard className="w-5 h-5" />,
  Clients: <Users className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Plus: <Plus className="w-5 h-5" />,
  Trash: <Trash2 className="w-4 h-4" />,
  Download: <Download className="w-4 h-4" />,
  Print: <Printer className="w-4 h-4" />,
  AI: <Sparkles className="w-4 h-4" />,
  Back: <ArrowLeft className="w-5 h-5" />,
  Check: <CheckCircle2 className="w-5 h-5" />,
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
