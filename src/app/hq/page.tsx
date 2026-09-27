import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function HqDashboard() {
  const supabase = await createClient()

  // Verify the user is still logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all data for the HQ panel
  const [
    { data: projects },
    { data: experiences },
    { data: education },
    { data: resumes },
    { data: testimonials },
    { data: skills }
  ] = await Promise.all([
    supabase.from('projects').select('*').order('sort_order', { ascending: true }),
    supabase.from('experiences').select('*').order('start_date', { ascending: false }),
    supabase.from('education').select('*').order('sort_order', { ascending: true }),
    supabase.from('resumes').select('*').order('created_at', { ascending: false }),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
    supabase.from('skills').select('*').order('category', { ascending: true })
  ])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">HQ Content Manager</h1>
        <form action="/auth/signout" method="post">
          <button className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-2">
            Logout
          </button>
        </form>
      </header>
      
      <AdminClient 
        projects={projects || []} 
        experiences={experiences || []} 
        education={education || []}
        resumes={resumes || []} 
        testimonials={testimonials || []}
        skills={skills || []}
      />
    </div>
  )
}
