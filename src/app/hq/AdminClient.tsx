'use client'

import { useState, useEffect } from 'react'
import { 
  addProject, 
  updateProject, 
  addExperience, 
  updateExperience,
  addEducation,
  updateEducation,
  addTestimonial, 
  updateTestimonial, 
  addSkill, 
  updateSkill, 
  deleteRecord, 
  addResumeRecord, 
  togglePublish 
} from './actions'
import { createClient } from '@/utils/supabase/client'
import { getTechIcon } from '@/utils/techIcons'
import { 
  Eye, 
  EyeOff, 
  Edit2, 
  Trash2, 
  UploadCloud, 
  Loader2, 
  Briefcase,
  GraduationCap,
  Wrench,
  Plus,
  Image as ImageIcon 
} from 'lucide-react'

const DEFAULT_STACK_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend & API',
  'Databases & Storage',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Workflow & Automation',
  'Data Analytics & BI',
]

function StackFormFields({
  editingItem,
  availableCategories,
  supabase,
}: {
  editingItem: any
  availableCategories: string[]
  supabase: any
}) {
  const [name, setName] = useState(editingItem?.name || '')
  const [selectedCategory, setSelectedCategory] = useState(
    editingItem?.category || availableCategories[0] || 'Languages'
  )
  const [isCustomCategory, setIsCustomCategory] = useState(
    Boolean(editingItem?.category && !availableCategories.includes(editingItem.category))
  )
  const [customCategory, setCustomCategory] = useState(
    isCustomCategory ? editingItem.category : ''
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-zinc-400 font-medium">Tool / Technology Name</label>
        <input
          required
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Next.js, FastAPI, Docker, Kestra"
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-400 font-medium">Category</label>
          <button
            type="button"
            onClick={() => setIsCustomCategory(!isCustomCategory)}
            className="text-[11px] text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            {isCustomCategory ? 'Pick from existing' : '+ Add new custom category'}
          </button>
        </div>

        {isCustomCategory ? (
          <input
            required
            name="category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Type new category (e.g. Mobile, Security, Blockchain)"
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
          />
        ) : (
          <select
            required
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Drag & Drop File Upload or URL entry */}
      <ImageUploadField
        label="Custom Logo / SVG (Drag & Drop or Enter URL)"
        name="icon_name"
        defaultValue={editingItem?.icon_name || ''}
        supabase={supabase}
        folder="tech-icons"
      />
    </div>
  )
}

function ImageUploadField({
  label,
  name,
  defaultValue = '',
  supabase,
  folder = 'logos',
}: {
  label: string
  name: string
  defaultValue?: string
  supabase: any
  folder?: string
}) {
  const [url, setUrl] = useState(defaultValue || '')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [manualMode, setManualMode] = useState(false)

  useEffect(() => {
    setUrl(defaultValue || '')
  }, [defaultValue])

  const handleFile = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)')
      return
    }

    try {
      setIsUploading(true)
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${folder}/${Date.now()}-${cleanName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath)

      setUrl(publicUrl)
    } catch (err: any) {
      console.error(err)
      alert(`Failed to upload image: ${err.message || 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300">{label}</label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-[11px] text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          {manualMode ? 'Upload from device' : 'Enter URL instead'}
        </button>
      </div>

      <input type="hidden" name={name} value={url} />

      {manualMode ? (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... or /logos/example.svg"
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
        />
      ) : url ? (
        <div className="flex items-center justify-between p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
              <img src={url} alt="Logo Preview" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-zinc-200 truncate max-w-[180px] sm:max-w-[220px] font-mono">
                {url.split('/').pop()}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Uploaded</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="cursor-pointer px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
              Change
              <input
                type="file"
                accept="image/*,.svg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
            <button
              type="button"
              onClick={() => setUrl('')}
              className="p-1 text-zinc-500 hover:text-red-400 transition-colors rounded-md hover:bg-zinc-800"
              title="Remove logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-950/20' 
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading to cloud...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center py-1">
              <UploadCloud className="w-5 h-5 text-zinc-400" />
              <p className="text-xs text-zinc-300 font-medium">
                <span className="text-emerald-400">Click to browse</span> or drag & drop
              </p>
              <p className="text-[10px] text-zinc-500">SVG, PNG, JPG, or WebP</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*,.svg"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
      )}
    </div>
  )
}

type Tab = 'projects' | 'experience' | 'education' | 'resumes' | 'testimonials' | 'stack'

export default function AdminClient({ 
  projects, 
  experiences, 
  education = [],
  resumes, 
  testimonials, 
  skills 
}: any) {
  const [activeTab, setActiveTab] = useState<Tab>('projects')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const tabs: { id: Tab, label: string }[] = [
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'stack', label: 'Stack' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'resumes', label: 'Resumes' },
  ]

  const availableCategories = Array.from(
    new Set([
      ...DEFAULT_STACK_CATEGORIES,
      ...(skills || []).map((s: any) => s.category).filter(Boolean),
    ])
  )

  async function handleDelete(table: string, id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteRecord(table, id)
    }
  }

  async function handleTogglePublish(table: string, id: string, currentStatus: boolean) {
    await togglePublish(table, id, currentStatus)
  }

  function openEdit(item: any) {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  function openNew() {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (activeTab === 'projects') {
        if (editingItem) await updateProject(editingItem.id, formData)
        else await addProject(formData)
      } else if (activeTab === 'experience') {
        if (editingItem) await updateExperience(editingItem.id, formData)
        else await addExperience(formData)
      } else if (activeTab === 'education') {
        if (editingItem) await updateEducation(editingItem.id, formData)
        else await addEducation(formData)
      } else if (activeTab === 'testimonials') {
        if (editingItem) await updateTestimonial(editingItem.id, formData)
        else await addTestimonial(formData)
      } else if (activeTab === 'stack') {
        if (editingItem) await updateSkill(editingItem.id, formData)
        else await addSkill(formData)
      } else if (activeTab === 'resumes') {
        const file = formData.get('resume_file') as File
        const versionName = formData.get('version_name') as string

        if (!file || file.size === 0) {
          alert('Please select a file to upload')
          setIsSubmitting(false)
          return
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(`resumes/${fileName}`, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(`resumes/${fileName}`)

        await addResumeRecord(versionName, publicUrl)
      }
      setIsModalOpen(false)
      setEditingItem(null)
    } catch (error: any) {
      console.error(error)
      alert(`Failed to save: ${error?.message || 'Please check your inputs and try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-800 pb-4">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingItem(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-zinc-900 border border-zinc-700 text-white' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-zinc-400 text-sm">Manage your portfolio {activeTab}</p>
        <button 
          onClick={openNew}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          + New {tabs.find(t => t.id === activeTab)?.label}
        </button>
      </div>

      {/* List Content */}
      <div className="flex flex-col gap-3">
        {/* PROJECTS */}
        {activeTab === 'projects' && projects.map((p: any) => (
          <div key={p.id} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-zinc-100 flex items-center gap-2">
                {p.title}
                {!p.is_published && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Draft</span>}
              </h3>
              <p className="text-xs text-zinc-500">{p.tech_stack?.join(' • ')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleTogglePublish('projects', p.id, p.is_published)} className="text-zinc-500 hover:text-white" title={p.is_published ? "Hide" : "Publish"}>
                {p.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(p)} className="text-zinc-500 hover:text-blue-400" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete('projects', p.id)} className="text-zinc-500 hover:text-red-400" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* EXPERIENCE */}
        {activeTab === 'experience' && experiences.map((e: any) => (
          <div key={e.id} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-3.5 pr-4 min-w-0">
              {e.company_logo_url ? (
                <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                  <img src={e.company_logo_url} alt={e.company} className="w-full h-full object-contain rounded-lg" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-zinc-500" />
                </div>
              )}
              <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="font-medium text-zinc-100 flex items-center gap-2 flex-wrap">
                  <span>{e.role}</span>
                  <span className="text-zinc-500">at</span>
                  <span className="text-red-400 font-semibold">{e.company}</span>
                  {!e.is_published && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Draft</span>}
                </h3>
                <p className="text-xs text-zinc-500">{e.start_date} to {e.end_date || 'Present'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => handleTogglePublish('experiences', e.id, e.is_published)} className="text-zinc-500 hover:text-white" title={e.is_published ? "Hide" : "Publish"}>
                {e.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(e)} className="text-zinc-500 hover:text-blue-400" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete('experiences', e.id)} className="text-zinc-500 hover:text-red-400" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* EDUCATION */}
        {activeTab === 'education' && education.map((ed: any) => (
          <div key={ed.id} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
            <div className="flex items-center gap-3.5 pr-4 min-w-0">
              {ed.institution_logo_url ? (
                <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                  <img src={ed.institution_logo_url} alt={ed.institution} className="w-full h-full object-contain rounded-lg" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-zinc-500" />
                </div>
              )}
              <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="font-medium text-zinc-100 flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-md font-semibold">
                    {ed.stage}
                  </span>
                  <span className="truncate">{ed.degree}</span>
                  {ed.is_current && <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-full">Current</span>}
                  {!ed.is_published && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Draft</span>}
                </h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 flex-wrap">
                  <span>{ed.institution}</span>
                  {ed.board && (
                    <span className="flex items-center gap-1 text-zinc-500">
                      • {ed.board_logo_url && <img src={ed.board_logo_url} alt="" className="w-3.5 h-3.5 rounded-full object-contain inline-block" />}
                      ({ed.board})
                    </span>
                  )}
                  <span className="font-mono text-zinc-500">• {ed.period}</span>
                </p>
                {ed.description && (
                  <p className="text-xs text-zinc-500 line-clamp-1 italic mt-0.5">"{ed.description}"</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => handleTogglePublish('education', ed.id, ed.is_published)} className="text-zinc-500 hover:text-white" title={ed.is_published ? "Hide" : "Publish"}>
                {ed.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(ed)} className="text-zinc-500 hover:text-blue-400" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete('education', ed.id)} className="text-zinc-500 hover:text-red-400" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* TESTIMONIALS */}
        {activeTab === 'testimonials' && testimonials.map((t: any) => (
          <div key={t.id} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-zinc-100 flex items-center gap-2">
                {t.author_name}
                {t.author_role && <span className="text-xs text-zinc-400 font-normal">({t.author_role})</span>}
                {!t.is_published && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Draft</span>}
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-1">{t.content}</p>
              {t.social_links && t.social_links.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {t.social_links.map((link: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                      {link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleTogglePublish('testimonials', t.id, t.is_published)} className="text-zinc-500 hover:text-white" title={t.is_published ? "Hide" : "Publish"}>
                {t.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(t)} className="text-zinc-500 hover:text-blue-400" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete('testimonials', t.id)} className="text-zinc-500 hover:text-red-400" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* STACK GRID */}
        {activeTab === 'stack' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {skills.map((s: any) => {
              const iconUrl = getTechIcon(s.name, s.icon_name);
              return (
                <div
                  key={s.id}
                  className="group relative p-4 bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-600 rounded-2xl flex items-center justify-between gap-3 hover:bg-zinc-900/60 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                      <img
                        src={iconUrl}
                        alt={s.name}
                        className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-semibold text-zinc-100 text-sm truncate group-hover:text-white transition-colors">
                        {s.name}
                      </h3>
                      <span className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {s.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800/80 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete('skills', s.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RESUMES */}
        {activeTab === 'resumes' && resumes.map((r: any) => (
          <div key={r.id} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-zinc-100">{r.version_name}</h3>
              <a href={r.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">View PDF</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleDelete('resumes', r.id)} className="text-zinc-500 hover:text-red-400" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? 'Edit' : 'Add New'} {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingItem(null); }} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            
            <form key={editingItem?.id || 'new'} onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              
              {/* PROJECTS FORM */}
              {activeTab === 'projects' && (
                <>
                  <input required name="title" defaultValue={editingItem?.title} placeholder="Project Title" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">Description (Markdown Supported)</label>
                    <textarea 
                      name="description" 
                      defaultValue={editingItem?.description} 
                      placeholder={"## The Problem\nExplain the problem...\n\n## The Solution\nExplain the solution...\n\n## Key Challenges\n* Challenge 1\n* Challenge 2"} 
                      rows={10} 
                      className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono text-sm" 
                    />
                  </div>

                  <input name="tech_stack" defaultValue={editingItem?.tech_stack?.join(', ')} placeholder="Tech Stack Tags (comma separated, e.g. React, Node.js, Python)" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <div className="flex gap-4">
                    <input name="github_link" defaultValue={editingItem?.github_link} type="url" placeholder="GitHub URL" className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                    <input name="live_link" defaultValue={editingItem?.live_link} type="url" placeholder="Live URL" className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  </div>
                </>
              )}

              {/* EXPERIENCE FORM */}
              {activeTab === 'experience' && (
                <>
                  <input required name="company" defaultValue={editingItem?.company} placeholder="Company Name" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <input required name="role" defaultValue={editingItem?.role} placeholder="Role / Title" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-xs text-zinc-400">Start Date</label>
                      <input required name="start_date" defaultValue={editingItem?.start_date} type="date" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-xs text-zinc-400">End Date (Leave blank for Present)</label>
                      <input name="end_date" defaultValue={editingItem?.end_date} type="date" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm" />
                    </div>
                  </div>
                  <ImageUploadField
                    label="Company Logo (Optional)"
                    name="company_logo_url"
                    defaultValue={editingItem?.company_logo_url}
                    supabase={supabase}
                    folder="logos"
                  />

                  <textarea name="description" defaultValue={editingItem?.description} placeholder="Description of your responsibilities..." rows={4} className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </>
              )}

              {/* EDUCATION FORM */}
              {activeTab === 'education' && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">Stage / Category</label>
                    <input required name="stage" defaultValue={editingItem?.stage} placeholder="e.g. Graduation, High Schooling, Junior Schooling, Masters" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">Degree / Qualification</label>
                    <input required name="degree" defaultValue={editingItem?.degree} placeholder="e.g. B.E in Computer Science Engineering (Data Science)" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">Institution Name</label>
                    <input required name="institution" defaultValue={editingItem?.institution} placeholder="e.g. A.P. Shah Institute Of Technology, Thane" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-xs text-zinc-400">Board / University</label>
                      <input name="board" defaultValue={editingItem?.board} placeholder="e.g. University of Mumbai / CBSE / CISCE" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-xs text-zinc-400">Period (Years)</label>
                      <input required name="period" defaultValue={editingItem?.period} placeholder="e.g. 2023 — 2027" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUploadField
                      label="Institute Logo (Optional)"
                      name="institution_logo_url"
                      defaultValue={editingItem?.institution_logo_url}
                      supabase={supabase}
                      folder="logos"
                    />
                    <ImageUploadField
                      label="Board Logo (Optional)"
                      name="board_logo_url"
                      defaultValue={editingItem?.board_logo_url}
                      supabase={supabase}
                      folder="logos"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">Description / Highlights (Optional)</label>
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Key coursework, achievements, CGPA, notable activities (Markdown supported)..." rows={3} className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm" />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="is_current" name="is_current" defaultChecked={editingItem?.is_current} className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500" />
                    <label htmlFor="is_current" className="text-sm text-zinc-300">Currently Pursuing</label>
                  </div>
                </>
              )}

              {/* TESTIMONIALS FORM */}
              {activeTab === 'testimonials' && (
                <>
                  <input required name="author_name" defaultValue={editingItem?.author_name} placeholder="Author Name" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <input name="author_role" defaultValue={editingItem?.author_role} placeholder="Author Role (e.g. CEO at Acme Corp)" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-zinc-400">Social Links (multiple links supported, comma-separated or one per line)</label>
                    <textarea 
                      name="social_links" 
                      defaultValue={editingItem?.social_links?.join('\n')} 
                      placeholder={"https://twitter.com/johndoe\nhttps://linkedin.com/in/johndoe\nhttps://github.com/johndoe"} 
                      rows={3} 
                      className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm" 
                    />
                  </div>

                  <textarea required name="content" defaultValue={editingItem?.content} placeholder="Testimonial content..." rows={4} className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </>
              )}

              {/* STACK FORM */}
              {activeTab === 'stack' && (
                <StackFormFields
                  editingItem={editingItem}
                  availableCategories={availableCategories}
                  supabase={supabase}
                />
              )}

              {/* RESUMES FORM */}
              {activeTab === 'resumes' && (
                <>
                  <input required name="version_name" placeholder="Version Name (e.g. Software Engineer 2024)" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <input required name="resume_file" type="file" accept=".pdf,.doc,.docx" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </>
              )}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingItem(null); }} className="px-4 py-2 font-medium text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
