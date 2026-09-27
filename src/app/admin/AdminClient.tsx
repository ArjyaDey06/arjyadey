'use client'

import { useState } from 'react'
import { 
  addProject, 
  updateProject, 
  addExperience, 
  updateExperience, 
  addTestimonial, 
  updateTestimonial, 
  addSkill, 
  updateSkill, 
  deleteRecord, 
  addResumeRecord, 
  togglePublish 
} from './actions'
import { createClient } from '@/utils/supabase/client'
import { Eye, EyeOff, Edit2, Trash2 } from 'lucide-react'

type Tab = 'projects' | 'experience' | 'resumes' | 'testimonials' | 'stack'

export default function AdminClient({ 
  projects, 
  experiences, 
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
    { id: 'resumes', label: 'Resumes' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'stack', label: 'Stack' },
  ]

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
    } catch (error) {
      console.error(error)
      alert('Failed to save. Please check your inputs and try again.')
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
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-zinc-100 flex items-center gap-2">
                {e.role} at {e.company}
                {!e.is_published && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Draft</span>}
              </h3>
              <p className="text-xs text-zinc-500">{e.start_date} to {e.end_date || 'Present'}</p>
            </div>
            <div className="flex items-center gap-3">
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

        {/* STACK */}
        {activeTab === 'stack' && skills.map((s: any) => (
          <div key={s.id} className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-zinc-100">{s.name}</h3>
              <p className="text-xs text-zinc-500">{s.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => openEdit(s)} className="text-zinc-500 hover:text-blue-400" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete('skills', s.id)} className="text-zinc-500 hover:text-red-400" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

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
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              
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
                  <textarea name="description" defaultValue={editingItem?.description} placeholder="Description of your responsibilities..." rows={4} className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
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
                <>
                  <input required name="name" defaultValue={editingItem?.name} placeholder="Skill Name (e.g. React)" className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <select required name="category" defaultValue={editingItem?.category || ""} className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white outline-none">
                    <option value="">Select Category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </>
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
