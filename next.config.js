//@ts-check

/**
 * A vitrine é o app padrão: atende `/` e tudo que nenhum outro microfrontend
 * reivindica. Os outros apps vivem sob o próprio basePath, em repositórios e
 * deploys próprios.
 *
 * No cluster quem roteia cada basePath para o seu app é o Ingress (Next.js
 * Multi-Zones). Por isso o build de produção NÃO tem rewrites: a vitrine não
 * conhece os outros apps e não é rebuildada quando eles publicam versão nova.
 *
 * - `npm run dev` (NODE_ENV=development): proxy para a porta local de cada app,
 *   para tudo funcionar em localhost:3000 como no cluster (o outro app precisa
 *   estar rodando).
 * - Build de produção: sem rewrites, a não ser que a variável `env` do app
 *   seja informada (ex.: PAINEL_URL=http://painel-mfe:4300).
 */
const MICROFRONTENDS = [{ basePath: '/painel', env: 'PAINEL_URL', port: 4300 }];

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // Os pacotes @whitelabel-store publicam TypeScript-fonte; o Next compila.
  transpilePackages: ['@whitelabel-store/ui', '@whitelabel-store/http'],

  // Como cada app usa o próprio basePath, os assets (/<basePath>/_next/*) já
  // caem no rewrite de :path*.
  async rewrites() {
    return MICROFRONTENDS.flatMap(({ basePath, env, port }) => {
      const url = process.env[env] || (isProduction ? undefined : `http://localhost:${port}`);
      if (!url) return [];
      return [
        { source: basePath, destination: `${url}${basePath}` },
        { source: `${basePath}/:path*`, destination: `${url}${basePath}/:path*` },
      ];
    });
  },
};

module.exports = nextConfig;
