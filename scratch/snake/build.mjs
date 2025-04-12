import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['index.ts'],
  bundle: true,
  outfile: 'index.js',
  sourcemap: 'inline'
})