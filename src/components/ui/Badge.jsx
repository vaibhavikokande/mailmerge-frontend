import React from 'react'

const VARIANTS = {
  blue:    'bg-blue-100   text-blue-700   border-blue-200',
  green:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber:   'bg-amber-100  text-amber-700  border-amber-200',
  red:     'bg-red-100    text-red-700    border-red-200',
  purple:  'bg-purple-100 text-purple-700 border-purple-200',
  slate:   'bg-slate-100  text-slate-600  border-slate-200',
  indigo:  'bg-indigo-100 text-indigo-700 border-indigo-200',
  rose:    'bg-rose-100   text-rose-700   border-rose-200',
}

export default function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${VARIANTS[variant] ?? VARIANTS.slate} ${className}`}>
      {children}
    </span>
  )
}
