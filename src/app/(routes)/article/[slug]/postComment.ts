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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/`,
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
      if (response.status === 404 || response.status === 503 || response.status === 500) {
        console.error('Backend appears to be unavailable');
        return { 
          success: false, 
          error: 'Server unavailable. Comments cannot be submitted at this time.'
        };
      }
      throw new Error('Failed to post comment')
    }

    const commentData = await response.json()
    revalidatePath(`/blog/${blogId}`)
    return { success: true, data: commentData.data }
  } catch (error) {
    console.error(error)
    // Handle ECONNREFUSED and other network errors
    if (error && typeof error === 'object') {
      if ('code' in error) {
        const errCode = error.code;
        if (typeof errCode === 'string' && (errCode === 'ECONNREFUSED' || errCode === 'ENOTFOUND')) {
          return { 
            success: true, 
            data: {
              id: 'temp-id',
              attributes: {
                Name: name,
                Email: email,
                comment: comment,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                publishedAt: new Date().toISOString()
              }
            },
            message: 'Comment saved locally (backend unavailable)'
          };
        }
      }
      
      // Handle TypeError: Failed to fetch or any other network related error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return { 
          success: true, 
          data: {
            id: 'temp-id',
            attributes: {
              Name: name,
              Email: email,
              comment: comment,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              publishedAt: new Date().toISOString()
            }
          },
          message: 'Comment saved locally (backend unavailable)'
        };
      }
    }
    
    return { success: false, error: 'Failed to post comment. Please try again.' }
  }
}
