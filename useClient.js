import path from "path";

const isOutputChunk = (moduleChunk) => "code" in moduleChunk;

const filesToTransform = new Map();

export const rollupPluginUseClient = ({ directive = "use client" } = {}) => ({
  name: "rollup-plugin-use-client",
  transform(code, id) {
    const file = path.parse(path.relative(`${process.cwd()}${path.sep}src`, id));
    filesToTransform.set(`${file.dir}${file.dir ? path.sep : ""}${file.name}`, code);
  },
  generateBundle(_outputOptions, bundle) {
    const keys = Object.keys(bundle);

    for (const moduleId of keys) {
      const outputModule = bundle[moduleId];

      if (isOutputChunk(outputModule)) {
        outputModule.code = `'${directive}';\n${outputModule.code}`;
      }
    }
  },
});

export default rollupPluginUseClient;
