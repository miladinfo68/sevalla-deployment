// @ts-check

// import eslint from '@eslint/js';
// import { defineConfig } from 'eslint/config';
// import tseslint from 'typescript-eslint';

// export default defineConfig(
//   eslint.configs.recommended,
//   tseslint.configs.recommended,
// );


// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Ignore patterns must be in their own config object at the beginning
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.js', // Ignore all JS files
      '!eslint.config.mjs' // Except the config file itself
    ]
  },
  
  // ESLint recommended config
  eslint.configs.recommended,
  
  // TypeScript ESLint recommended config
  ...tseslint.configs.recommended,

  // Custom rules
  {
    rules: {
      'no-console': 'off',
    },
    // languageOptions: {
    //   globals: {
    //     // Node.js globals
    //     console: 'readonly',
    //     process: 'readonly',
    //     __dirname: 'readonly', 
    //     __filename: 'readonly',
    //     require: 'readonly',
    //     module: 'readonly',
    //     exports: 'readonly',
    //     Buffer: 'readonly',
    //     setImmediate: 'readonly',
    //     clearImmediate: 'readonly',
    //     setInterval: 'readonly',
    //     clearInterval: 'readonly',
    //     setTimeout: 'readonly',
    //     clearTimeout: 'readonly',
    //     global: 'readonly'
    //   }
    // }
  },
]);