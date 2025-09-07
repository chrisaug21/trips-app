'use client'

import { useMemo, useState } from 'react'

type Step = 'basics' | 'geos' | 'dates' | 'interests' | 'constraints' | 'review'

export default function NewTripForm() {
  const [step, setStep] = useState<Step>('basics')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [countries, setCountries] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [season, setSeason] = useState('')
  const [duration, setDuration] = useState<number | ''>('')
  const [interests, setInterests] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const [constraints, setConstraints] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canNext = useMemo(() => true, [step])

  async function submit() {
    setSubmitting(true)
    try {
      const payload = {
        title: title || undefined,
        description: description || undefined,
        interests,
        metadata: {
          geographies: { countries, regions, cities },
          dates: { start: start || undefined, end: end || undefined, season: season || undefined },
          durationDays: typeof duration === 'number' ? duration : undefined,
          constraints: constraints || undefined,
        },
      }
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create trip')
      const json = await res.json()
      window.location.href = `/admin/trips/${json.trip.id}`
    } catch (e) {
      alert('Error creating trip')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="tabs tabs-boxed">
        {(['basics','geos','dates','interests','constraints','review'] as Step[]).map((s) => (
          <button key={s} className={`tab ${step === s ? 'tab-active' : ''}`} onClick={() => setStep(s)}>
            {s}
          </button>
        ))}
      </div>

      {step === 'basics' && (
        <div className="space-y-4">
          <input className="input input-bordered w-full" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="textarea textarea-bordered w-full" placeholder="Summary/description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      )}

      {step === 'geos' && (
        <div className="space-y-4">
          <TagInput label="Countries" values={countries} setValues={setCountries} />
          <TagInput label="Regions" values={regions} setValues={setRegions} />
          <TagInput label="Cities" values={cities} setValues={setCities} />
        </div>
      )}

      {step === 'dates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" className="input input-bordered" value={start} onChange={(e) => setStart(e.target.value)} />
          <input type="date" className="input input-bordered" value={end} onChange={(e) => setEnd(e.target.value)} />
          <input placeholder="Season (e.g., Spring)" className="input input-bordered md:col-span-2" value={season} onChange={(e) => setSeason(e.target.value)} />
          <input type="number" min={1} max={60} placeholder="Duration days" className="input input-bordered md:col-span-2" value={duration} onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')} />
        </div>
      )}

      {step === 'interests' && (
        <div className="space-y-4">
          <PresetInterests selected={interests} setSelected={setInterests} />
          <div className="flex gap-2">
            <input className="input input-bordered flex-1" placeholder="Add custom interest" value={customInterest} onChange={(e) => setCustomInterest(e.target.value)} />
            <button className="btn" onClick={() => { if (customInterest.trim()) { setInterests((p) => Array.from(new Set([...p, customInterest.trim()]))); setCustomInterest('') } }}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <span key={i} className="badge badge-outline">
                {i}
                <button className="ml-2" onClick={() => setInterests((p) => p.filter((x) => x !== i))}>✕</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {step === 'constraints' && (
        <textarea className="textarea textarea-bordered w-full" placeholder="Constraints (budget, mobility, dietary, pace, etc.)" value={constraints} onChange={(e) => setConstraints(e.target.value)} />
      )}

      {step === 'review' && (
        <div className="space-y-3">
          <div><span className="font-semibold">Title:</span> {title || '(untitled)'}</div>
          <div><span className="font-semibold">Countries:</span> {countries.join(', ') || '-'}</div>
          <div><span className="font-semibold">Dates:</span> {start || '-'} → {end || '-'} ({season || '-'})</div>
          <div><span className="font-semibold">Duration:</span> {duration || '-'}</div>
          <div><span className="font-semibold">Interests:</span> {interests.join(', ') || '-'}</div>
          <div><span className="font-semibold">Constraints:</span> {constraints || '-'}</div>
        </div>
      )}

      <div className="flex justify-between">
        <button className="btn" disabled={step === 'basics'} onClick={() => setStep(prev(step))}>Back</button>
        {step !== 'review' ? (
          <button className="btn btn-primary" disabled={!canNext} onClick={() => setStep(next(step))}>Next</button>
        ) : (
          <button className="btn btn-primary" onClick={submit} disabled={submitting}>{submitting ? 'Saving…' : 'Save Draft'}</button>
        )}
      </div>
    </div>
  )
}

function next(s: Step): Step {
  const order: Step[] = ['basics','geos','dates','interests','constraints','review']
  const idx = order.indexOf(s)
  return order[Math.min(order.length - 1, idx + 1)]
}
function prev(s: Step): Step {
  const order: Step[] = ['basics','geos','dates','interests','constraints','review']
  const idx = order.indexOf(s)
  return order[Math.max(0, idx - 1)]
}

function TagInput({ label, values, setValues }: { label: string; values: string[]; setValues: (v: string[]) => void }) {
  const [value, setValue] = useState('')
  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="input input-bordered flex-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Add ${label.toLowerCase()}`} />
        <button className="btn" onClick={() => { const v = value.trim(); if (v) { setValues(Array.from(new Set([...values, v]))); setValue('') } }}>Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="badge badge-outline">
            {v}
            <button className="ml-2" onClick={() => setValues(values.filter((x) => x !== v))}>✕</button>
          </span>
        ))}
      </div>
    </div>
  )
}

const PRESETS = ['Food', 'Museums', 'Hiking', 'Architecture', 'Beaches', 'Cafes', 'Markets', 'Photography']
function PresetInterests({ selected, setSelected }: { selected: string[]; setSelected: (s: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((p) => {
        const active = selected.includes(p)
        return (
          <button type="button" key={p} className={`btn btn-sm ${active ? 'btn-primary' : ''}`} onClick={() => {
            setSelected(active ? selected.filter((x) => x !== p) : [...selected, p])
          }}>
            {p}
          </button>
        )
      })}
    </div>
  )
}


