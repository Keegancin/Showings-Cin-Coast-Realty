import { contextBridge } from 'electron';

// Expose minimal info to the renderer if needed
contextBridge.exposeInMainWorld('app', {
  platform: process.platform,
});
