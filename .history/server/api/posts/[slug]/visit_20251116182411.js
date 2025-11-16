// server/api/posts/[slug]/visit.post.ts
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    // Get client info
    const ip = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown'
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const referer = getHeader(event, 'referer') || 'direct'

    // Here you can store visits in:
    // - JSON file (simple)
    // - Database (production)
    // - Redis (high performance)
    
    // Simple JSON file storage example:
    const storage = useStorage('visits')
    const visitKey = `post:${slug}`
    
    // Get current visits
    let postVisits = (await storage.getItem(visitKey)) as any[] || []
    
    // Add new visit
    const visit = {
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      referer,
      slug
    }
    
    postVisits.push(visit)
    
    // Keep only last 1000 visits per post to prevent memory issues
    if (postVisits.length > 1000) {
      postVisits = postVisits.slice(-1000)
    }
    
    await storage.setItem(visitKey, postVisits)
    
    return {
      success: true,
      totalVisits: postVisits.length,
      slug
    }
    
  } catch (error) {
    console.error('Error recording visit:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to record visit'
    })
  }
})