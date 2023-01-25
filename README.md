# inlang-plugin-po

This plugin reads and writes resources that are stored as .po file. The following features are supported:

- [x] ID (`"msgid": "id"`)
- [x] messages (`"msgstr": "value"`)

#### Recommendation for now:
Use a .pot file in your project. It is easier to manage the ids in a file instead of in the code




## Usage

1. Create a new file named `inlang.config.js` in the root of your git repository.
2. Copy/paste the following code into the config
3. Adapt the referenceLanguage, languages and pathPattern (your saved translation files)

 If you need more help read the [inlang documentation](https://inlang.com/documentation/getting-started)

```js
/**
 * @type {import("@inlang/core/config").DefineConfig}
 */
export async function defineConfig(env) {
  // importing plugin from local file for testing purposes
  const plugin = await env.$import("../dist/index.js");

  const pluginConfig = {
    // language mean the name of you file
    pathPattern: "./example/{language}.po",
  };

  return {
Ff your project uses a pot file, use it as a reference language. 
// !! do not include the .pot file in the Languages array 
/**
 * @example
 * example files: en.pot, de.po, es.po, fr.po
 *  referenceLanguage: "en",
    languages: ["de","es","fr"],
 */
    referenceLanguage: "en",
    languages: ["de","es","fr"],
    readResources: (args) =>
      plugin.readResources({ ...args, ...env, pluginConfig }),
    writeResources: (args) =>
      plugin.writeResources({ ...args, ...env, pluginConfig }),
  };
}
```

For additional usage information, take a look at [example](./example/).

## Contributing

### Developing

Run the following commands in your terminal (node and npm must be installed):

1. `npm install`
2. `npm run dev`

`npm run dev` will start the development environment which automatically compiles the [src/index.ts](./src/index.ts) files to JavaScript ([dist/index.js](dist/index.js)), runs tests defined in `*.test.ts` files and watches changes.

### Publishing

Run `npm run build` to generate a build.

The [dist](./dist/) directory is used to distribute the plugin directly via CDN like [jsDelivr](https://www.jsdelivr.com/). Using a CDN works because the inlang config uses dynamic imports to import plugins.

Read the [jsDelivr documentation](https://www.jsdelivr.com/?docs=gh) on importing from GitHub.
