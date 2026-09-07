// Vinext's CLI explicitly exits after building. Let Windows drain native worker
// handles first; preserve every exit code, including failures.
if (process.platform === 'win32')
  process.exit = (code) => {
    process.exitCode = code ?? 0;
  };
process.argv = [process.argv[0], process.argv[1], 'build'];
await import('../node_modules/vinext/dist/cli.js');
