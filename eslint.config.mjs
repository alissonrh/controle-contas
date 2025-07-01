import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Aplica regras recomendadas do ESLint para JS/TS
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  // 2. Define variáveis globais do ambiente browser
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser }
  },
  // 3. Adiciona as recomendações do typescript-eslint
  ...tseslint.configs.recommended,
  // 4. Define regras personalizadas para todo o código
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "no-console": "warn",      // Aviso para uso de console.log
      "no-unused-vars": "warn",  // Aviso para variáveis não usadas
      "prefer-const": "error"    // Erro se não usar const quando possível
    }
  },
  // 5. Especifica o tsconfig.json para arquivos TypeScript
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: "./tsconfig.json",
      }
    }
  },
  // 6. Permite 'any' apenas em arquivos de teste
  {
    files: ["**/*.test.ts", "**/*.test.js", "**/*.spec.ts", "**/*.spec.js"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
]);