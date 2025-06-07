export default defineNitroPlugin(async (nitroApp) => {
  console.info('Initializing Fedify plugin...')
  const { federation } = await useFederation()

  // Bind the federation to the Nitro app
  const fedifyeventHandler = defineEventHandler(async (event) => {
    const request = requestFromEvent(event)
    // const wantsNuxt = event.headers.get('accept')?.includes('html')
    // if (wantsNuxt) {
    //   console.warn('Request is not ActivityPub compatible, skipping federation handling.')
    //   return sendError(event, createError({ statusCode: 400, statusMessage: 'Request is not ActivityPub compatible' }))
    // }
    return await federation.fetch(request, { contextData: void 0 })
  })

  nitroApp.router.post('/inbox', fedifyeventHandler) // Shared inbox for all actors
  nitroApp.router.get('/user/:identifier', fedifyeventHandler) // Actor endpoint for specific user
  nitroApp.router.post('/user/:identifier/inbox', fedifyeventHandler) // User-specific inbox endpoint

  // Cloudflare Workers integration
  nitroApp.hooks.hook('cloudflare:queue', ({ batch, env }) => {
    for (const message of batch.messages) {
      federation.processQueuedTask(void 0, message)
    }
  })
})
