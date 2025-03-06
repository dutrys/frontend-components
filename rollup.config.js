import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import useClient from "./useClient.js";

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
    input: "src/utils/index.ts",
    output: [
      {
        file: "dist/utils/index.js",
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
      useClient(),
    ],
    external: [
      "react/jsx-runtime",
      "date-fns",
      "date-fns/locale",
      "next-intl",
      "@heroicons/react/24/outline",
      "react",
      "next/navigation",
      "react-tooltip",
      "react-hot-toast",
    ],
  },
  {
    input: "src/form/index.ts",
    output: [
      {
        file: "dist/form/index.js",
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
      "@heroicons/react/24/outline",
      "react-day-picker",
      "date-fns",
      "react-day-picker/locale",
      "@tanstack/react-query",
      "@headlessui/react",
      "classnames",
      "@heroicons/react/20/solid",
      "@sentry/nextjs",
      "next-intl",
      "react-hot-toast",
      "react/jsx-runtime",
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
