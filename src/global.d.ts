// O TypeScript 6 exige declaração para imports de efeito colateral, como o
// `import './global.css'` do layout (o Next processa o CSS no build).
declare module '*.css';
