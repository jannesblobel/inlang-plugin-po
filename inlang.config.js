/**
 * @type {import("@inlang/core/config").DefineConfig}
 */
export async function defineConfig(env) {
  // importing plugin from local file for testing purposes
  const plugin = await env.$import("../dist/index.js");

  const pluginConfig = {
    pathPattern: "./example/locale/{language}/LC_MESSAGES/django.po",
    // pathPattern: "./example/{language}.po",

    // Your referenceResourcePath could be
    // null or "./example/locale/en/LC_MESSAGES/django.pot",
    // dependent if you use pot file as you referenceLanguage
    referenceResourcePath: null,
  };

  return {
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
