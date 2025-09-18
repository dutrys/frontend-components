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
      useClient(),
    ],
    external: [
      "react",
      "react/jsx-runtime",
      "next/link",
      "next/navigation",
      "next-intl",
      "classnames",
      "date-fns",
      "date-fns/locale",
      "date-fns-tz",
      "react-hot-toast",
      "react-hook-form",
      "@sentry/nextjs",
      "@floating-ui/react",
      "react-tooltip",
      "@heroicons/react/24/outline",
    ],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
