// Prints which module `dep`'s `#mode` subpath import resolved to, in `vite` (serve), for three
// optimizeDeps settings.
import { createServer } from 'vite';

const cases = {
  'pre-bundled (include)': { include: ['dep'] },
  'not pre-bundled (exclude)': { exclude: ['dep'] },
  'pre-bundled + rolldownOptions.resolve.conditionNames': {
    include: ['dep'],
    rolldownOptions: { resolve: { conditionNames: ['development', 'module', 'browser', 'import', 'default'] } },
  },
};
for (const [name, optimizeDeps] of Object.entries(cases)) {
  const server = await createServer({
    configFile: false,
    logLevel: 'silent',
    cacheDir: `node_modules/.vite-${Object.keys(cases).indexOf(name)}`,
    optimizeDeps,
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  const env = server.environments.client;
  await env.depsOptimizer?.init?.();
  const { id } = await env.pluginContainer.resolveId('dep', `${process.cwd()}/main.js`);
  let code = (await env.transformRequest(id.replace(process.cwd(), '')))?.code ?? '';
  for (const m of code.matchAll(/from ["']([^"']+)["']/g)) code += (await env.transformRequest(m[1]))?.code ?? '';
  const mode = /["']development["']/.test(code) ? 'development' : /["']production["']/.test(code) ? 'production' : '?';
  console.log(`${name}: ${mode}`);
  await server.close();
}
