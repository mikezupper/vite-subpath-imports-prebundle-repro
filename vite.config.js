// Pre-bundle `dep` (as Vite does for any dependency it discovers). The page shows
// "production", although `vite` serves in development. With optimizeDeps.exclude: ['dep'] it
// shows "development".
export default { optimizeDeps: { include: ['dep'] } };
