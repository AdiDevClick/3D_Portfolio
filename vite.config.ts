import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dns from 'node:dns';
// https://vite.dev/config/
dns.setDefaultResultOrder('verbatim');
export default defineConfig({
    plugins: [react()],
    base: '/3D_Portfolio/',
    // base: '/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        chunkSizeWarningLimit: 2000,
        // rollupOptions: {
        //     // output: {
        //     //     manualChunks: {
        //     //         'three-vendor': ['three'],
        //     //         'react-drei': ['@react-three/drei'],
        //     //         'react-fiber': ['@react-three/fiber'],
        //     //     },
        //     // },
        //     external: [
        //         'react',
        //         'three',
        //         '@react-three/drei',
        //         '@react-three/fiber',
        //     ],
        // },
    },
    // server: {
    //     // origin: 'https://http://192.168.1.181:5173',
    //     // origin: 'http://localhost:5173',
    //     origin: 'https://127.0.0.1:80',
    //     // origin: 'https://localhost:5173', // Règle le problème des chemins dans le CSS
    //     // warmup: {
    //     //     clientFiles: ["./src/components/*.vue", "./src/utils/big-utils.js"],
    //     //     ssrFiles: ["./src/server/modules/*.js"],
    //     // },
    //     // hmr: {
    //     // host: '192.168.1.181',
    //     // host: '192.168.1.97',
    //     // host: '192.168.1.100',
    //     // host: 'vite.adi',
    //     // }
    // },
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, 'src'),
            },
            {
                find: '@assets',
                replacement: resolve(__dirname, 'src/assets'),
            },
            {
                find: '@css',
                replacement: resolve(__dirname, 'src/assets/css'),
            },
            {
                find: '@images',
                replacement: resolve(__dirname, 'src/assets/images'),
            },
            {
                find: '@icons',
                replacement: resolve(__dirname, 'src/assets/icons'),
            },
            {
                find: '@models',
                replacement: resolve(__dirname, 'src/assets/3DModels'),
            },
            {
                find: '@data',
                replacement: resolve(__dirname, 'src/data'),
            },
            {
                find: '@utils',
                replacement: resolve(__dirname, 'src/utils'),
            },
            {
                find: '@hooks',
                replacement: resolve(__dirname, 'src/hooks'),
            },
        ],
    },
    assetsInclude: [
        '**/*.gltf',
        '**/*.glb',
        '**/*.mtl',
        '**/*.obj',
        '**/*.fbx',
    ],
    // optimizeDeps: {
    //     exclude: ['three'],
    // },
});

// export default defineConfig({
//     plugins: [react(), tsconfigPaths()],
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, 'src'),
//             assets: path.resolve(__dirname, 'src/assets'),
//             css: path.resolve(__dirname, 'src/assets/css'),
//             images: path.resolve(__dirname, 'src/assets/images'),
//             models: path.resolve(__dirname, 'src/3DModels'),
//         },
//     },
// });
