/**
 * @type {import("@inlang/core/config").DefineConfig}
 */
export async function defineConfig(env) {
  // importing plugin from local file for testing purposes
  const plugin = await env.$import("../dist/index.js");

  const pluginConfig = {
    // language mean the name of you file
    pathPattern: "./example/locale/{language}/LC_MESSAGES/django.po",
    referenceResourcePath: null,
  };

  return {
    /**
 * @example
 * example files: en.pot, de.po, es.po, fr.po
 *  referenceLanguage: "en",
    languages: ["de","es","fr"],
 */
    referenceLanguage: "en",
    languages: await plugin.getLanguages({
      referenceLanguage: "en",
      ...env,
      pluginConfig,
    }),
    readResources: (args) =>
      plugin.readResources({ ...args, ...env, pluginConfig }),
    writeResources: (args) =>
      plugin.writeResources({ ...args, ...env, pluginConfig }),
  };
}
