import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['test.ts'],
  bundle: true,
  outfile: 'test.js',
  sourcemap: 'linked'
})