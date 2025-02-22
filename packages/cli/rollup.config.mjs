// @ts-check
import fs from 'fs'
import path from 'pathe'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import license from 'rollup-plugin-license'
import chalk from 'chalk'
import fg from 'fast-glob'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')))

// import pkg from './package.json'

const entries = [
  // commands because why not
  'src/index.ts',
  // cli app
  'src/cli.ts',
]

const dtsEntries = ['src/index.ts']

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  'vite-node/server',
  'vite-node/client',
  'vite-node/utils',
  'path', // huh?
]

function configurePlugins(isProduction) {
  return [
    alias({
      entries: [{ find: /^node:(.+)$/, replacement: '$1' }],
    }),
    resolve({ preferBuiltins: true }),
    json(),
    commonjs(),
    esbuild({ target: 'node14', minify: isProduction }),
  ]
}

export default ({ watch }) => {
  const isProduction = process.env.NODE_ENV === 'production'
  return [
    {
      input: entries,
      output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: isProduction ? false : 'inline',
        chunkFileNames: (chunkInfo) => {
          const id =
            chunkInfo.facadeModuleId ||
            Object.keys(chunkInfo.modules).find(
              (i) => !i.includes('node_modules') && i.includes('src/')
            )
          if (id) {
            const parts = Array.from(
              new Set(
                path
                  .relative(process.cwd(), id)
                  .split(/\//g)
                  .map((i) => i.replace(/\..*$/, ''))
                  .filter(
                    (i) =>
                      !['src', 'index', 'dist', 'node_modules'].some((j) =>
                        i.includes(j)
                      ) && i.match(/^[\w_-]+$/)
                  )
              )
            )
            if (parts.length)
              return `chunk-${parts.slice(-2).join('-')}.[hash].js`
          }
          return 'vendor-[name].[hash].js'
        },
      },
      external,
      plugins: [...configurePlugins(isProduction), !watch && licensePlugin()],
      onwarn(message) {
        if (/Circular dependencies/.test(message)) return
        console.error(message)
      },
    },
    ...dtsEntries.map((input) => ({
      input,
      output: {
        file: input.replace('src/', 'dist/').replace('.ts', '.d.ts'),
        format: 'esm',
      },
      external,
      plugins: [dts({ respectExternal: true })],
    })),
  ]
}

function licensePlugin() {
  return license({
    thirdParty(dependencies) {
      // https://github.com/rollup/rollup/blob/master/build-plugins/generate-license-file.js
      // MIT Licensed https://github.com/rollup/rollup/blob/master/LICENSE-CORE.md
      const coreLicense = fs.readFileSync(
        path.resolve(__dirname, '../../LICENSE')
      )
      function sortLicenses(licenses) {
        let withParenthesis = []
        let noParenthesis = []
        licenses.forEach((license) => {
          if (/^\(/.test(license)) withParenthesis.push(license)
          else noParenthesis.push(license)
        })
        withParenthesis = withParenthesis.sort()
        noParenthesis = noParenthesis.sort()
        return [...noParenthesis, ...withParenthesis]
      }
      const licenses = new Set()
      const dependencyLicenseTexts = dependencies
        .sort(({ name: nameA }, { name: nameB }) =>
          nameA > nameB ? 1 : nameB > nameA ? -1 : 0
        )
        .map(
          ({
            name,
            license,
            licenseText,
            author,
            maintainers,
            contributors,
            repository,
          }) => {
            let text = `## ${name}\n\n`
            if (license) text += `License: ${license}\n`

            const names = new Set()
            if (author && author.name) names.add(author.name)

            for (const person of maintainers.concat(contributors)) {
              if (person && person.name) names.add(person.name)
            }
            if (names.size > 0) text += `By: ${Array.from(names).join(', ')}\n`

            if (repository)
              text += `Repository: ${repository.url || repository}\n`

            if (!licenseText) {
              try {
                const pkgDir = path.dirname(
                  path.resolve(path.join(name, 'package.json'))
                )
                const licenseFile = fg.sync(`${pkgDir}/LICENSE*`, {
                  caseSensitiveMatch: false,
                })[0]
                if (licenseFile)
                  licenseText = fs.readFileSync(licenseFile, 'utf-8')
              } catch {}
            }
            if (licenseText) {
              text += `\n${licenseText
                .trim()
                .replace(/(\r\n|\r)/gm, '\n')
                .split('\n')
                .map((line) => `> ${line}`.trimEnd())
                .join('\n')}\n`
            }
            licenses.add(license)
            return text
          }
        )
        .join('\n---------------------------------------\n\n')
      const licenseText =
        '# Vue TermUI core license\n\n' +
        `Vue TermUI is released under the MIT license:\n\n${coreLicense}\n` +
        `# Licenses of bundled dependencies\n\n` +
        'The published Vue Term UI artifact additionally contains code with the following licenses:\n' +
        `${sortLicenses(licenses).join(', ')}\n\n` +
        `# Bundled dependencies:\n\n${dependencyLicenseTexts}`
      const existingLicenseText = fs.readFileSync('LICENSE.md', 'utf8')
      if (existingLicenseText !== licenseText) {
        fs.writeFileSync('LICENSE.md', licenseText)
        console.warn(
          chalk.yellow(
            '\nLICENSE.md updated. You should commit the updated file.\n'
          )
        )
      }
    },
  })
}
