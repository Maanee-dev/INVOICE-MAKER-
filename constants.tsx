
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

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg 
    version="1.0" 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 600.000000 600.000000"
    preserveAspectRatio="xMidYMid meet"
    className={className}
  >
    <g transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
      <path d="M1730 3035 c0 -454 2 -825 4 -825 3 0 114 149 247 330 134 182 246
      329 250 328 4 -2 120 -144 259 -316 l253 -312 159 2 160 3 -2 703 -1 702 229
      0 c253 0 301 -8 379 -61 190 -131 142 -381 -87 -454 -42 -14 -102 -19 -252
      -23 -109 -2 -198 -6 -198 -9 0 -3 125 -181 277 -397 152 -215 288 -408 302
      -428 l26 -38 128 0 c70 0 127 3 126 8 0 4 -103 156 -228 337 -136 197 -223
      332 -217 336 6 4 33 9 61 13 130 17 276 130 343 265 36 72 37 79 37 181 0 103
      -1 108 -39 186 -49 98 -125 176 -221 226 -128 66 -158 69 -624 66 l-414 -3
      -366 -502 c-201 -276 -369 -503 -373 -503 -5 0 -8 227 -8 505 l0 505 -105 0
      -105 0 0 -825z m1124 636 c-1 -23 -2 -309 -3 -637 l-1 -596 -241 299 c-132
      164 -243 303 -245 309 -4 9 199 296 455 641 13 18 27 31 30 29 3 -2 5 -23 5
      -45z"/>
      <path d="M4162 2435 c-44 -19 -67 -73 -52 -120 16 -49 45 -70 97 -70 37 0 49
      5 69 28 13 15 27 40 30 54 9 36 -21 88 -61 107 -39 19 -41 19 -83 1z"/>
    </g>
  </svg>
);

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
  name: 'KUREVII PVT LTD',
  email: 'hello@kurevi.com',
  address: 'Vinares Tower 1 A, 2300\nK. Hulhumale\', Maldives',
  website: 'www.kurevi.com',
  phone: '+960 777-0000',
  registration: 'C13882025 / 2025PV01246E'
};
