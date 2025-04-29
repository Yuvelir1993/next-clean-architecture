module.exports = {
  options: {
    exclude: "node_modules",
    includeOnly: "^(src|app|di|shared|public|tests)/",
    tsConfig: {
      fileName: "tsconfig.json",
    },
  },
  forbidden: [
    {
      name: "no-circular",
      comment: "Detects circular dependencies between your modules",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-app-to-business",
      comment:
        "Modules in `app/` must not depend on the business layer (`src/business`).",
      severity: "error",
      from: {
        path: "^app/",
      },
      to: {
        path: "^src/business/",
      },
    },
    {
      name: "no-app-to-infrastructure",
      comment:
        "Modules in `app/` must not depend on the infra layer (`src/infrastructure`).",
      severity: "error",
      from: {
        path: "^app/",
      },
      to: {
        path: "^src/infrastructure/",
      },
    },
  ],
};
