import { getState, setState, createInstance, deleteInstance, getAllInstances, getInstancesByType } from './state.js'

export const setupSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[socket] Cliente conectado: ${socket.id}`)

    socket.on('overlay:sync', async ({ overlayId }) => {
      if (!overlayId) return
      socket.join(overlayId)
      const instance = await getState(overlayId)
      socket.emit('overlay:sync', { overlayId, type: instance?.type ?? null, state: instance?.state ?? null })
      console.log(`[socket] Sync enviado para ${overlayId}:`, instance?.state)
    })

    socket.on('overlay:show', async ({ overlayId, data }) => {
      const instance = await setState(overlayId, { visible: true, ...data })
      io.to(overlayId).emit('overlay:show', { overlayId, state: instance?.state })
      console.log(`[socket] show → ${overlayId}`)
    })

    socket.on('overlay:hide', async ({ overlayId }) => {
      const instance = await setState(overlayId, { visible: false })
      io.to(overlayId).emit('overlay:hide', { overlayId, state: instance?.state })
      console.log(`[socket] hide → ${overlayId}`)
    })

    socket.on('overlay:update', async ({ overlayId, data }) => {
      const instance = await setState(overlayId, data)
      io.to(overlayId).emit('overlay:update', { overlayId, state: instance?.state })
      console.log(`[socket] update → ${overlayId}:`, data)
    })

    socket.on('instance:create', async ({ type, name, defaultState = {} }) => {
      const instance = await createInstance(type, name, defaultState)
      socket.emit('instance:created', instance)
      console.log(`[socket] instance:created → ${instance.id}`)
    })

    socket.on('instance:delete', async ({ id }) => {
      const deleted = await deleteInstance(id)
      if (deleted) {
        socket.emit('instance:deleted', { id })
        console.log(`[socket] instance:deleted → ${id}`)
      } else {
        console.warn(`[socket] instance:delete — ID não encontrado: ${id}`)
      }
    })

    socket.on('instance:list', async ({ type } = {}) => {
      const instances = type
        ? await getInstancesByType(type)
        : await getAllInstances()
      socket.emit('instances:data', instances)
      console.log(`[socket] instances:data → ${instances.length} instância(s)${type ? ` do tipo "${type}"` : ''}`)
    })

    socket.on('disconnect', () => {
      console.log(`[socket] Cliente desconectado: ${socket.id}`)
    })
  })
}
