import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Use FlatCompat to extend configurations
export default compat.config({
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'react',
    'prettier',
    'react-hooks', // For React hooks linting
    'import', // For linting imports
  ],
  rules: {
    'prettier/prettier': 'error', // Enforce Prettier formatting
    'react/react-in-jsx-scope': 'off', // Disable rule if using Next.js (React is always in scope)
    'import/no-unresolved': 'error', // Error on unresolved imports
    'react/prop-types': 'off', // If you're using TypeScript, no need for prop-types
    // Add any other custom rules you need here
  },
});
