/**
 * @type {import("@inlang/core/config").DefineConfig}
 */
export async function defineConfig(env) {
  // importing plugin from local file for testing purposes
  const plugin = await env.$import("../dist/index.js");

  const pluginConfig = {
    // language mean the name of you file
    pathPattern: "./rest_framework_simplejwt/locale/fr/LC_MESSAGES/django.po",
  };
  return {
    referenceLanguage: "fr",
    languages: ["fr", "de","cs","ro"],
    readResources: (args) =>
      plugin.readResources({ ...args, ...env, pluginConfig }),
    writeResources: (args) =>
      plugin.writeResources({ ...args, ...env, pluginConfig }),
  };
}
