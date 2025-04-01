import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            // js
            js.configs.recommended,
            // ts
            ...tseslint.configs.recommended,
            // a11y (accessibility
            jsxA11y.flatConfigs.recommended,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
                alias: {
                    map: [
                        ['@models', './src/3DModels'],
                        ['@assets', './src/assets'],
                        ['@css', './src/assets/css'],
                        ['@images', './src/assets/images'],
                        ['@', './src/'],
                    ],
                    extensions: [
                        '.js',
                        '.jsx',
                        '.ts',
                        '.tsx',
                        '.gltf',
                        '.css',
                        '.scss',
                        '.mtl',
                        '.obj',
                    ],
                },
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            indent: ['error', 4],
        },
    }
);
