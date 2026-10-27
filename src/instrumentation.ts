/**
 * Roda uma vez quando o servidor Next sobe (next dev / next start).
 * Valida as variáveis de ambiente já na subida: faltou uma em produção, o
 * processo termina com a mensagem (no cluster: CrashLoopBackOff com o motivo
 * no log do pod), em vez de ficar no ar respondendo erro.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  try {
    await import('./config/env');
  } catch (error) {
    console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
    // Sozinho, o Next só registra o erro e continua no ar.
    process.exit(1);
  }
}
