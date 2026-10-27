/**
 * Subida do servidor (runtime nodejs): valida as variáveis de ambiente. Faltou
 * uma em produção, o processo termina com a mensagem (no cluster:
 * CrashLoopBackOff com o motivo no log do pod), em vez de ficar no ar
 * respondendo erro — sozinho, o Next só registra o erro e continua.
 */
export async function validateEnv() {
  try {
    await import('./config/env');
  } catch (error) {
    console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
