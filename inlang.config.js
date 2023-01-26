/**
 * @type {import("@inlang/core/config").DefineConfig}
 */
export async function defineConfig(env) {
  // importing plugin from local file for testing purposes
  const plugin = await env.$import("../dist/index.js");

  const pluginConfig = {
    // language mean the name of you file
    pathPattern: "./example/{language}.po",
    referenceResourcePath: "./example/en.pot",
  };

  return {
    // if your project use a pot file use the pot as the reference Language
    // !! do not add the pot file in the Languages array
    /**
 * @example
 * example files: en.pot, de.po, es.po, fr.po
 *  referenceLanguage: "en",
    languages: ["de","es","fr"],
 */
    referenceLanguage: "en",
    languages: ["de", "es", "fr"],
    readResources: (args) =>
      plugin.readResources({ ...args, ...env, pluginConfig }),
    writeResources: (args) =>
      plugin.writeResources({ ...args, ...env, pluginConfig }),
  };
}
