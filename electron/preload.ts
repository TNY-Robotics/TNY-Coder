// This is the preload script for Electron.
// It runs in the renderer process before the page is loaded.
// --------------------------------------------

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

process.once('loaded', () => {
//   - Exposed variables will be accessible at "window.[...]".
  contextBridge.exposeInMainWorld('ipc', {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
    on: (channel: string, func: (_event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, func)
  })
})