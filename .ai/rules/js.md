---
paths:
  - 'resources/js/**/*.tsx'
  - 'resources/js/**/*.ts'
---

# Js

## Use PascalCase for frontend filenames
Use PascalCase for handwritten frontend module filenames, including components, utilities, data, types, and associated CSS modules. Match component files to their component names (DocumentList.tsx, Button.tsx). Keep exported function and variable names in camelCase. Keep app.tsx and index.tsx as entry points. Update imports with the exact filename casing, including shared UI components added by generators. Leave Wayfinder-generated files under actions, routes, and wayfinder under generator control.

## Use PascalCase for handwritten TypeScript modules
Use PascalCase for handwritten utility, data, type, and declaration filenames (CreateDocumentContent.ts, Formatters.ts, StaticDocuments.ts, Types.ts, Auth.ts, Global.d.ts, ViteEnv.d.ts). Keep exported functions and variables in camelCase. Preserve index.ts barrel files and Wayfinder-generated filenames under actions, routes, and wayfinder. Update import paths and generator aliases to match renamed modules.
