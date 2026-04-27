import React, { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, Mail } from 'lucide-react'
import Modal from './ui/Modal'
import Badge from './ui/Badge'

// ── Default template data ─────────────────────────────────────────────────────
const DEFAULT_TEMPLATES = [
  {
    id: 1,
    name:    'Welcome Email',
    subject: 'Welcome to MailMerge — Let\'s get started!',
    preview: 'Thanks for reaching out. We\'re excited to connect with you...',
    tag:     'Onboarding',
    tagVar:  'blue',
    body:    `Hi {{first_name}},\n\nWelcome to MailMerge! We're excited to have you on board.\n\nWe noticed you're interested in {{service_needed}} — our team is ready to help you get started.\n\nBook a quick 15-min call: {{cal_link}}\n\nBest regards,\nThe MailMerge Team`,
  },
  {
    id: 2,
    name:    'Follow-up #1',
    subject: 'Quick follow-up on your enquiry',
    preview: 'Just checking in to see if you had any questions...',
    tag:     'Follow-up',
    tagVar:  'amber',
    body:    `Hi {{first_name}},\n\nI wanted to follow up on your recent enquiry about {{service_needed}}.\n\nHave you had a chance to review our proposal? Happy to jump on a quick call to answer any questions.\n\nReply to this email or book time here: {{cal_link}}\n\nTalk soon,\n{{sender_name}}`,
  },
  {
    id: 3,
    name:    'Product Demo Invite',
    subject: 'Ready for a 15-min product demo?',
    preview: 'See how MailMerge can help your team close more leads...',
    tag:     'Demo',
    tagVar:  'green',
    body:    `Hi {{first_name}},\n\nI'd love to show you how MailMerge can help {{company_name}} streamline outreach and close more deals.\n\nThis is a 15-minute no-pressure demo — I'll show you the exact features that matter for your use case.\n\n👉 Book your slot: {{cal_link}}\n\nLooking forward to it,\n{{sender_name}}`,
  },
  {
    id: 4,
    name:    'Cold Outreach',
    subject: 'Quick question for {{first_name}}',
    preview: 'I came across your company and had a quick thought...',
    tag:     'Outreach',
    tagVar:  'purple',
    body:    `Hi {{first_name}},\n\nI came across {{company_name}} and noticed you might benefit from better lead automation.\n\nWe help teams like yours cut outreach time by 60% using smart email sequences.\n\nWould you be open to a 10-min chat this week?\n\nBest,\n{{sender_name}}`,
  },
  {
    id: 5,
    name:    'Proposal Email',
    subject: 'Custom proposal for {{company_name}}',
    preview: 'Here\'s the tailored proposal we put together for your team...',
    tag:     'Proposal',
    tagVar:  'indigo',
    body:    `Hi {{first_name}},\n\nThank you for taking the time to speak with us. As discussed, I've attached a custom proposal for {{company_name}}.\n\nHighlights:\n• {{service_needed}} starting from $X/month\n• Dedicated account manager\n• Onboarding within 48 hours\n\nLet me know if you'd like to adjust anything.\n\nBest,\n{{sender_name}}`,
  },
  {
    id: 6,
    name:    'Re-engagement',
    subject: 'We miss you, {{first_name}} 👋',
    preview: 'It\'s been a while — we wanted to check in and see how things are...',
    tag:     'Re-engage',
    tagVar:  'rose',
    body:    `Hi {{first_name}},\n\nWe haven't heard from you in a while and wanted to check in.\n\nIf you're still looking for help with {{service_needed}}, we'd love to reconnect. Things have changed a lot — we now offer:\n\n✅ Faster onboarding\n✅ New pricing plans\n✅ 24/7 support\n\nHappy to jump on a quick call at your convenience.\n\n{{sender_name}}`,
  },
]

// ── Template Card ─────────────────────────────────────────────────────────────
function TemplateCard({ tpl, onEdit, onDelete, onPreview }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Mail size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="text-slate-800 font-semibold text-[14px] leading-tight">{tpl.name}</p>
            <Badge variant={tpl.tagVar} className="mt-0.5">{tpl.tag}</Badge>
          </div>
        </div>
      </div>

      <div>
        <p className="text-slate-500 text-[12px] font-medium">Subject</p>
        <p className="text-slate-700 text-[13px] mt-0.5 line-clamp-1">{tpl.subject}</p>
      </div>

      <p className="text-slate-400 text-[12px] line-clamp-2 flex-1">{tpl.preview}</p>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
        <button
          onClick={() => onPreview(tpl)}
          className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-600 font-medium transition-colors"
        >
          <Eye size={13} /> Preview
        </button>
        <button
          onClick={() => onEdit(tpl)}
          className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-600 font-medium transition-colors ml-2"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(tpl.id)}
          className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-red-600 font-medium transition-colors ml-auto"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  )
}

// ── Editor / Preview Modal ────────────────────────────────────────────────────
const BLANK_TPL = { id: null, name: '', subject: '', preview: '', tag: 'Outreach', tagVar: 'slate', body: '' }

function TemplateModal({ open, onClose, template, onSave, readOnly }) {
  const [form, setForm] = useState(template || BLANK_TPL)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  React.useEffect(() => { setForm(template || BLANK_TPL) }, [template])

  return (
    <Modal open={open} onClose={onClose} title={readOnly ? 'Preview Template' : template?.id ? 'Edit Template' : 'New Template'} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {!readOnly && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">Template Name *</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Welcome Email" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-800 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-slate-600 block mb-1">Tag</label>
              <input value={form.tag} onChange={set('tag')} placeholder="e.g. Follow-up" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-800 placeholder:text-slate-400" />
            </div>
          </div>
        )}
        <div>
          <label className="text-[12px] font-medium text-slate-600 block mb-1">Subject Line</label>
          {readOnly
            ? <p className="text-slate-700 text-sm py-1">{form.subject}</p>
            : <input value={form.subject} onChange={set('subject')} placeholder="Email subject…" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-800 placeholder:text-slate-400" />
          }
        </div>
        <div>
          <label className="text-[12px] font-medium text-slate-600 block mb-1">Email Body</label>
          {readOnly
            ? <pre className="text-slate-700 text-[13px] whitespace-pre-wrap bg-slate-50 rounded-lg p-4 font-sans leading-relaxed min-h-[180px]">{form.body}</pre>
            : <textarea
                value={form.body}
                onChange={set('body')}
                placeholder="Write your email body here…&#10;Use {{first_name}}, {{company_name}} as merge tags."
                rows={10}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-slate-800 placeholder:text-slate-400 font-mono resize-none"
              />
          }
        </div>
        {!readOnly && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-400">Merge tags: <code className="bg-slate-100 px-1 rounded">{'{{first_name}}'}</code> <code className="bg-slate-100 px-1 rounded">{'{{company_name}}'}</code> <code className="bg-slate-100 px-1 rounded">{'{{service_needed}}'}</code></p>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
              <button onClick={() => { onSave(form); onClose() }} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Save Template</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Templates() {
  const [templates,  setTemplates]  = useState(DEFAULT_TEMPLATES)
  const [modal,      setModal]      = useState({ open: false, tpl: null, mode: 'edit' })

  function openNew()        { setModal({ open: true, tpl: BLANK_TPL,  mode: 'edit'    }) }
  function openEdit(tpl)    { setModal({ open: true, tpl,             mode: 'edit'    }) }
  function openPreview(tpl) { setModal({ open: true, tpl,             mode: 'preview' }) }
  function closeModal()     { setModal(m => ({ ...m, open: false })) }

  function handleSave(form) {
    setTemplates(prev =>
      form.id
        ? prev.map(t => t.id === form.id ? { ...form, preview: form.body.slice(0, 80) + '…' } : t)
        : [{ ...form, id: Date.now(), preview: form.body.slice(0, 80) + '…', tagVar: 'slate' }, ...prev]
    )
  }

  function handleDelete(id) {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 text-xl font-bold">Email Templates</h1>
          <p className="text-slate-400 text-sm mt-0.5">{templates.length} templates</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm shadow-blue-200 transition-colors"
        >
          <Plus size={15} /> New Template
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map(tpl => (
          <TemplateCard
            key={tpl.id}
            tpl={tpl}
            onEdit={openEdit}
            onDelete={handleDelete}
            onPreview={openPreview}
          />
        ))}
      </div>

      <TemplateModal
        open={modal.open}
        onClose={closeModal}
        template={modal.tpl}
        onSave={handleSave}
        readOnly={modal.mode === 'preview'}
      />
    </div>
  )
}
