import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
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
                find: '@models',
                replacement: resolve(__dirname, 'src/3DModels'),
            },
            {
                find: '@data',
                replacement: resolve(__dirname, 'src/data'),
            },
        ],
    },
    // assetsInclude: [
    //     '**/*.gltf',
    //     '**/*.glb',
    //     '**/*.mtl',
    //     '**/*.obj',
    //     '**/*.fbx',
    // ],
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
