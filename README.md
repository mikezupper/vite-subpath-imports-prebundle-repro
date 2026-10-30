# Vite: pre-bundled dependency's `#subpath` imports lose the `development` condition

`dep` (a local package) switches a module with a subpath import:

```json
"imports": { "#mode": { "development": "./dev.js", "default": "./prod.js" } }
```

```sh
npm install
npm run check   # prints which module #mode resolved to in `vite` (serve)
npm run dev     # the page shows "production" although Vite serves in development
```

Output with Vite 8.3.4:

```
pre-bundled (include): production
not pre-bundled (exclude): development
pre-bundled + rolldownOptions.resolve.conditionNames: development
```
