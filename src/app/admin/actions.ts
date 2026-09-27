'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return supabase
}

export async function addProject(formData: FormData) {
  const supabase = await checkAuth()
  
  const techStackString = formData.get('tech_stack') as string
  const tech_stack = techStackString ? techStackString.split(',').map((t) => t.trim()).filter(Boolean) : []

  await supabase.from('projects').insert([{
    title: formData.get('title'),
    description: formData.get('description'),
    tech_stack,
    github_link: formData.get('github_link'),
    live_link: formData.get('live_link'),
    is_published: true,
  }])

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await checkAuth()
  
  const techStackString = formData.get('tech_stack') as string
  const tech_stack = techStackString ? techStackString.split(',').map((t) => t.trim()).filter(Boolean) : []

  await supabase.from('projects').update({
    title: formData.get('title'),
    description: formData.get('description'),
    tech_stack,
    github_link: formData.get('github_link'),
    live_link: formData.get('live_link'),
  }).eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function addExperience(formData: FormData) {
  const supabase = await checkAuth()
  
  const { error } = await supabase.from('experiences').insert([{
    company: formData.get('company'),
    role: formData.get('role'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date') || null,
    description: formData.get('description'),
    company_logo_url: formData.get('company_logo_url') || null,
    is_published: true,
  }])

  if (error) {
    console.error('addExperience error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await checkAuth()
  
  const { error } = await supabase.from('experiences').update({
    company: formData.get('company'),
    role: formData.get('role'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date') || null,
    description: formData.get('description'),
    company_logo_url: formData.get('company_logo_url') || null,
  }).eq('id', id)

  if (error) {
    console.error('updateExperience error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function addEducation(formData: FormData) {
  const supabase = await checkAuth()
  
  const { error } = await supabase.from('education').insert([{
    stage: formData.get('stage'),
    degree: formData.get('degree'),
    institution: formData.get('institution'),
    board: formData.get('board'),
    period: formData.get('period'),
    description: formData.get('description'),
    institution_logo_url: formData.get('institution_logo_url') || null,
    board_logo_url: formData.get('board_logo_url') || null,
    is_current: formData.get('is_current') === 'on',
    is_published: true,
  }])

  if (error) {
    console.error('addEducation error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateEducation(id: string, formData: FormData) {
  const supabase = await checkAuth()
  
  const { error } = await supabase.from('education').update({
    stage: formData.get('stage'),
    degree: formData.get('degree'),
    institution: formData.get('institution'),
    board: formData.get('board'),
    period: formData.get('period'),
    description: formData.get('description'),
    institution_logo_url: formData.get('institution_logo_url') || null,
    board_logo_url: formData.get('board_logo_url') || null,
    is_current: formData.get('is_current') === 'on',
  }).eq('id', id)

  if (error) {
    console.error('updateEducation error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function addTestimonial(formData: FormData) {
  const supabase = await checkAuth()
  
  const socialsString = formData.get('social_links') as string
  const social_links = socialsString 
    ? socialsString.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : []

  await supabase.from('testimonials').insert([{
    author_name: formData.get('author_name'),
    author_role: formData.get('author_role'),
    content: formData.get('content'),
    social_links,
    is_published: true,
  }])

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateTestimonial(id: string, formData: FormData) {
  const supabase = await checkAuth()
  
  const socialsString = formData.get('social_links') as string
  const social_links = socialsString 
    ? socialsString.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : []

  await supabase.from('testimonials').update({
    author_name: formData.get('author_name'),
    author_role: formData.get('author_role'),
    content: formData.get('content'),
    social_links,
  }).eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function addSkill(formData: FormData) {
  const supabase = await checkAuth()
  
  const icon_name = (formData.get('icon_name') as string)?.trim() || null

  const { error } = await supabase.from('skills').insert([{
    name: formData.get('name'),
    category: formData.get('category'),
    icon_name,
  }])

  if (error) {
    console.error('addSkill error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await checkAuth()
  
  const icon_name = (formData.get('icon_name') as string)?.trim() || null

  const { error } = await supabase.from('skills').update({
    name: formData.get('name'),
    category: formData.get('category'),
    icon_name,
  }).eq('id', id)

  if (error) {
    console.error('updateSkill error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function addResumeRecord(version_name: string, file_url: string) {
  const supabase = await checkAuth()
  
  await supabase.from('resumes').insert([{
    version_name,
    file_url,
    is_active: true,
  }])

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deleteRecord(table: string, id: string) {
  const supabase = await checkAuth()
  await supabase.from(table).delete().eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function togglePublish(table: string, id: string, currentStatus: boolean) {
  const supabase = await checkAuth()
  await supabase.from(table).update({ is_published: !currentStatus }).eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/')
}
