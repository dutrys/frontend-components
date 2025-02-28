import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      postcss({
        modules: true,
        extract: true,
      }),
    ],
    external: ["react/jsx-runtime", "react", "@floating-ui/react"],
  },
  {
    input: "src/dialog.ts",
    output: [
      {
        file: "dist/dialog.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      postcss({
        modules: true,
        extract: true,
      }),
    ],
    external: [
      "react/jsx-runtime",
      "react",
      "next/navigation",
      "react-tooltip",
      "react-hot-toast",
      "next-intl",
      "@sentry/nextjs",
      "react-hook-form",
    ],
  },
  {
    input: "src/form.ts",
    output: [
      {
        file: "dist/form.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      postcss({
        modules: true,
        extract: true,
      }),
    ],
    external: [
      "@floating-ui/react",
      "react-number-format",
      "react",
      "react-hook-form",
      "react-tooltip",
      "next/navigation",
      "date-fns-tz",
    ],
  },
  {
    input: "src/hot-keys.ts",
    output: [
      {
        file: "dist/hot-keys.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(),
      postcss({
        modules: true,
        extract: true,
      }),
    ],
    external: ["react/jsx-runtime", "react-hot-toast", "next-intl", "react"],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
