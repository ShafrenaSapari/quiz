import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins: PluginOption[] = [vue(), vueJsx()]

  if (process.env.NODE_ENV !== 'production') {
    const devToolsPlugin = await vueDevTools()
    const extra = Array.isArray(devToolsPlugin) ? devToolsPlugin : [devToolsPlugin]
    plugins.push(...(extra.filter(Boolean) as PluginOption[]))
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
