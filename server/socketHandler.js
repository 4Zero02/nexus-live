import { getState, setState } from './state.js'

export const setupSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[socket] Cliente conectado: ${socket.id}`)

    socket.on('overlay:sync', async ({ overlayId }) => {
      if (!overlayId) return
      socket.join(overlayId)
      const instance = await getState(overlayId)
      socket.emit('overlay:sync', { overlayId, state: instance?.state ?? null })
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

    socket.on('disconnect', () => {
      console.log(`[socket] Cliente desconectado: ${socket.id}`)
    })
  })
}
