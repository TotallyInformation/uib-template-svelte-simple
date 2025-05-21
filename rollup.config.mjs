// @ts-nocheck
import svelte from 'rollup-plugin-svelte' // https://github.com/sveltejs/rollup-plugin-svelte
import commonjs from '@rollup/plugin-commonjs' // https://github.com/rollup/plugins/tree/master/packages/commonjs
import resolve from '@rollup/plugin-node-resolve' // https://github.com/rollup/plugins/tree/master/packages/node-resolve
import livereload from 'rollup-plugin-livereload' // https://github.com/thgh/rollup-plugin-livereload
import terser from '@rollup/plugin-terser' // https://github.com/rollup/plugins/tree/master/packages/terser
import css from 'rollup-plugin-css-only' // https://github.com/thgh/rollup-plugin-css-only

import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Added for uibuilder - the build output folder
const uibDist = 'dist'
// The source folder for the app
const uibSrc = 'src'

// Assume production mode if not running dev
const production = !process.env.ROLLUP_WATCH
console.log(`Production mode?: ${ production }. Output Folder: ${__dirname}/${uibDist}/build/`) // eslint-disable-line no-undef

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex')
}

async function filesDiffer(srcPath, distPath) {
  try {
    const [srcContent, distContent] = await Promise.all([
      fs.readFile(srcPath),
      fs.readFile(distPath).catch(() => null)
    ])

    if (!distContent) return true
    return hash(srcContent) !== hash(distContent)
  } catch {
    return true
  }
}

/** Custom copy plugin 
 * @description This plugin copies files from srcDir to distDir if they differ or if the destination file doesn't exist.
 * It also watches the source files for changes and copies them again if they change.
 * @param {string} srcDir - Source directory
 * @param {string} distDir - Destination directory
 * @param {string[]} watchedAssets - List of assets to watch/copy
 * @returns {Object} Rollup plugin object
*/
function conditionalCopyPlugin(srcDir, distDir, watchedAssets) {
  const fullWatchPaths = watchedAssets.map(f => path.resolve(srcDir, f))

  return {
    name: 'conditional-copy',
    async buildStart() {
      for (const file of watchedAssets) {
        const srcPath = path.join(srcDir, file)
        const distPath = path.join(distDir, file)
        if (await filesDiffer(srcPath, distPath)) {
          await fs.mkdir(path.dirname(distPath), { recursive: true })
          await fs.copyFile(srcPath, distPath)
          this.warn(`Copied (initial): ${file}`)
        }

        // Watch file manually to respond to changes
        this.addWatchFile(srcPath)
      }
    },

    async watchChange(id) {
      const srcIndex = fullWatchPaths.findIndex(watched => watched === path.resolve(id))
      if (srcIndex !== -1) {
        const file = watchedAssets[srcIndex]
        const srcPath = path.resolve(srcDir, file)
        const distPath = path.resolve(distDir, file)

        if (await filesDiffer(srcPath, distPath)) {
          await fs.copyFile(srcPath, distPath)
          this.warn(`Copied (updated): ${file}`)
        }
      }
    }
  }
}

/** Define the dev server - this works correctly with uibuilder and Node-RED to
 *  automatically reload the browser when the bundle is updated.
 * @returns {Function} writeBundle
 */
function serve() {
    let server

    function toExit() { // eslint-disable-line jsdoc/require-jsdoc
        if (server) server.kill(0)
    }

    return {
        writeBundle() {
            if (server) return
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            })

            process.on('SIGTERM', toExit)
            process.on('exit', toExit)
        }
    }
}

export default {
    // The source entry point for the app, it references src/App.svelte
    input: `${uibSrc}/main.js`,
    output: {
        // Produce js source maps for easier browser debugging
        sourcemap: true,
        // Use IIFE (script) style output for browser rather than ESM
        format: 'iife',
        // The name for the Svelte app
        name: 'app',
        // The output, bundled js
        file: `${uibDist}/build/bundle.js`,
    },

    plugins: [
        // Build Svelte components
        svelte({
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            }
        }),

        // Extract any Svelte component CSS into
        // a separate file - better for performance.
        css({ output: 'bundle.css' }),
        // There is also a seperate master global CSS file.

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),

        // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
        commonjs(),

        // Copies non-js/svelte files as needed.
        conditionalCopyPlugin(uibSrc, uibDist, ['index.html', 'index.css', 'favicon.png']),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `src` directory and refresh the
        // browser on changes when not in production
        !production && livereload({watch: uibDist}),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser({
            ecma: 2019, // ES6+ (matches spec of UIBUILDER FE code)
            mangle: { toplevel: true },
            compress: {
                module: true,
                toplevel: true,
                unsafe_arrows: true,
                drop_console: production,
                drop_debugger: production,
            },
            output: { comments: false } ,
        }),
    ],
    watch: {
        clearScreen: false,
    },
}
