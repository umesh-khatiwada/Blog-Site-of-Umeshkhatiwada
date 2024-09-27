'use server'

import { revalidatePath } from 'next/cache'

export async function postComment(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const comment = formData.get('comment') as string
  const blogId = formData.get('blogId') as string

  if (!name || !email || !comment || !blogId) {
    return { error: 'All fields are required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}comments/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            blog: blogId,
            Email: email,
            Name: name,
            comment: comment,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to post comment')
    }

    const commentData = await response.json()
    revalidatePath(`/blog/${blogId}`)
    return { success: true, data: commentData.data }
  } catch (error) {
    console.error(error)
    return { error: 'Failed to post comment. Please try again.' }
  }
}
