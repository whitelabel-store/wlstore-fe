/**
 * Roda uma vez quando o servidor Next sobe (next dev / next start).
 * O Next compila este arquivo também para o Edge Runtime; por isso o que é
 * só de Node (process.exit) fica em instrumentation-node.ts, importado só no
 * runtime nodejs.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('./instrumentation-node');
    await validateEnv();
  }
}
