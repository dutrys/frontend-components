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
        modules: true, // Įjungia CSS modulius
        extract: true, // Sukuria atskirą `dist/index.css` failą
      }),
    ],
    external: ["react", "react-hook-form", "react-tooltip", "next/navigation"],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
