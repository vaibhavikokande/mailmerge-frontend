import React, { useState } from 'react'
import { User, Bell, Link2, CheckCircle2, Moon, RefreshCw, Globe, Shield } from 'lucide-react'

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  )
}

// ── Section Card wrapper ──────────────────────────────────────────────────────
function Section({ icon: Icon, title, sub, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon size={16} className="text-blue-600" />
        </div>
        <div>
          <p className="text-slate-800 font-semibold text-[14px]">{title}</p>
          {sub && <p className="text-slate-400 text-[11px]">{sub}</p>}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

// ── Save Toast ────────────────────────────────────────────────────────────────
function SaveToast({ visible }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-xl animate-fade-in">
      <CheckCircle2 size={15} className="text-emerald-400" />
      Settings saved
    </div>
  )
}

// ── Integration Row ────────────────────────────────────────────────────────────
function IntegrationRow({ name, description, status, connected }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-slate-800 text-sm font-medium">{name}</p>
        <p className="text-slate-400 text-[12px] mt-0.5">{description}</p>
      </div>
      {connected
        ? <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
          </span>
        : <button className="text-[12px] font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
            Connect
          </button>
      }
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Settings() {
  const [profile, setProfile] = useState({
    name:     'MailMerge Admin',
    email:    'nikhil.selokar@ibntech.com',
    role:     'CRM Administrator',
    timezone: 'Asia/Kolkata',
  })

  const [prefs, setPrefs] = useState({
    darkMode:      false,
    autoRefresh:   true,
    notifications: true,
    compactView:   false,
    language:      'en',
    refreshRate:   '5',
  })

  const [toast, setToast] = useState(false)

  function setP(k) { return e => setProfile(p => ({ ...p, [k]: e.target.value })) }
  function setPref(k) { return v => setPrefs(p => ({ ...p, [k]: v }) ) }
  function setPrefVal(k) { return e => setPrefs(p => ({ ...p, [k]: e.target.value })) }

  function handleSave() {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-800 placeholder:text-slate-400 bg-white"
  const labelCls = "text-[12px] font-medium text-slate-600 block mb-1"

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-slate-900 text-xl font-bold">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your profile and preferences</p>
      </div>

      {/* 1. Profile */}
      <Section icon={User} title="Profile Settings" sub="Your account information">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {profile.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{profile.name}</p>
            <p className="text-slate-400 text-[12px]">{profile.role}</p>
            <button className="text-[12px] text-blue-600 hover:text-blue-700 font-medium mt-1 transition-colors">
              Change avatar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input value={profile.name} onChange={setP('name')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input value={profile.email} onChange={setP('email')} type="email" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <input value={profile.role} onChange={setP('role')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Timezone</label>
            <select value={profile.timezone} onChange={setP('timezone')} className={inputCls}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New York (EST)</option>
              <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Paris">Europe/Paris (CET)</option>
            </select>
          </div>
        </div>
      </Section>

      {/* 2. Preferences */}
      <Section icon={Bell} title="Preferences" sub="Customize your dashboard experience">
        <div className="space-y-4">
          {[
            { key: 'darkMode',      label: 'Dark Mode',         sub: 'Switch to dark theme',              icon: Moon       },
            { key: 'autoRefresh',   label: 'Auto-Refresh',      sub: 'Automatically fetch new leads',     icon: RefreshCw  },
            { key: 'notifications', label: 'Notifications',     sub: 'Get alerts for new lead activity',  icon: Bell       },
            { key: 'compactView',   label: 'Compact Table View', sub: 'Reduce row height in lead tables', icon: Globe      },
          ].map(({ key, label, sub, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon size={13} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-slate-700 text-sm font-medium">{label}</p>
                  <p className="text-slate-400 text-[11px]">{sub}</p>
                </div>
              </div>
              <Toggle checked={prefs[key]} onChange={setPref(key)} />
            </div>
          ))}

          {prefs.autoRefresh && (
            <div className="pl-10 pt-1">
              <label className={labelCls}>Refresh Interval</label>
              <select value={prefs.refreshRate} onChange={setPrefVal('refreshRate')} className={`${inputCls} max-w-[180px]`}>
                <option value="5">Every 5 seconds</option>
                <option value="10">Every 10 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every minute</option>
              </select>
            </div>
          )}
        </div>
      </Section>

      {/* 3. Integrations */}
      <Section icon={Link2} title="Integrations" sub="Connected tools and services">
        <IntegrationRow
          name="Google Sheets"
          description={`Sheet ID: 1tl9h9W9P8Xw7C-EsJl8fNJtWSFmbN29Ax2hnf5ivZiI`}
          connected
        />
        <IntegrationRow
          name="n8n Automation"
          description="Connect your n8n workflows to trigger on new leads"
          connected={false}
        />
        <IntegrationRow
          name="Brevo (Sendinblue)"
          description="Sync contacts and automate email sequences"
          connected={false}
        />
        <IntegrationRow
          name="Slack Notifications"
          description="Get notified in Slack when high-intent leads come in"
          connected={false}
        />
      </Section>

      {/* 4. Security */}
      <Section icon={Shield} title="Security" sub="Account security settings">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-slate-700 text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-slate-400 text-[12px]">Add an extra layer of security to your account</p>
            </div>
            <button className="text-[12px] font-medium text-blue-600 hover:text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-50">
            <div>
              <p className="text-slate-700 text-sm font-medium">Change Password</p>
              <p className="text-slate-400 text-[12px]">Last changed 30 days ago</p>
            </div>
            <button className="text-[12px] font-medium text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1 rounded-lg transition-colors">
              Update
            </button>
          </div>
        </div>
      </Section>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <button className="px-5 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm shadow-blue-200 transition-colors"
        >
          Save Settings
        </button>
      </div>

      <SaveToast visible={toast} />
    </div>
  )
}
