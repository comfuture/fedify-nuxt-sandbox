import { createFederationBuilder, Endpoints, MemoryKvStore, type Federation } from '@fedify/fedify'
import { Person, Follow } from '@fedify/fedify/vocab'

let federation: Federation<void> | undefined = undefined

export const useFederation = async () => {
  if (!federation) {
    const builder = createFederationBuilder<void>()

    builder.setActorDispatcher('/user/{identifier}', async (ctx, identifier) => {
      if (identifier !== 'me') {
        // throw new Error('Invalid actor identifier')
        return null
      }
      return new Person({
        id: ctx.getActorUri(identifier),
        name: 'Me',
        preferredUsername: 'me',
        summary: 'This is me',
        inbox: ctx.getInboxUri(identifier),
        endpoints: new Endpoints({
          sharedInbox: ctx.getInboxUri()
        })
      })
    })

    builder.setInboxListeners("/user/{identifier}/inbox", "/inbox")
      .on(Follow, async (ctx, follow) => {
      })

    federation = await builder.build({
      kv: new MemoryKvStore()
    })
  }
  return { federation }
}