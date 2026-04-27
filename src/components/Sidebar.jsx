import React from 'react'
import {
  LayoutDashboard, Users, Megaphone, FileText, BarChart2, Settings, Mail
} from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { id: 'contacts',  label: 'Contacts',   Icon: Users           },
  { id: 'campaigns', label: 'Campaigns',  Icon: Megaphone       },
  { id: 'templates', label: 'Templates',  Icon: FileText        },
  { id: 'analytics', label: 'Analytics',  Icon: BarChart2       },
  { id: 'settings',  label: 'Settings',   Icon: Settings        },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-[#0f172a] flex flex-col z-30 select-none">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
          <Mail size={16} className="text-white" />
        </div>
        <span className="text-white font-bold text-[15px] tracking-tight">MailMerge</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 text-left
                ${active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/6'
                }`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-slate-500'} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
            MM
          </div>
          <div>
            <p className="text-white text-[12px] font-medium leading-none">MailMerge CRM</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
