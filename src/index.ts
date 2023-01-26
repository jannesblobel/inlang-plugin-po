import type { Config, EnvironmentFunctions } from "@inlang/core/config";
import type * as ast from "@inlang/core/ast";
import gettextParser, { GetTextTranslation } from "gettext-parser";

/**
 * The plugin configuration.
 */
export type PluginConfig = {
  /**
   * Defines the path pattern for the resources.
   *
   * Must include the `{language}` placeholder.
   *
   * @example
   *  "./resources/{language}.json"
   */
  pathPattern: string;
};

/**
 * Reading resources.
 *
 * The function merges the args from Config['readResources'] with the pluginConfig
 * and EnvironmentFunctions.
 */
export async function readResources(
  // merging the first argument from config (which contains all arguments)
  // with the custom pluginConfig argument
  args: Parameters<Config["readResources"]>[0] &
    EnvironmentFunctions & {
      pluginConfig: PluginConfig;
    }
): ReturnType<Config["readResources"]> {
  const result: ast.Resource[] = [];

  if (args.config.referenceLanguage === "auto") {
    const translationIds: string[][] = [[""]];
    const testObject = {};
    for (const language of args.config.languages) {
      const resourcePath = args.pluginConfig.pathPattern.replace(
        "{language}",
        language
      );
      const poFile = gettextParser.po.parse(
        (await args.$fs.readFile(resourcePath, "utf-8")) as string
      );
      translationIds.push(
        // console.log(
        Object.keys(poFile.translations[""]).filter(
          (translation) => translation[0] !== ""
        )
      );
    }
    // !!Runs twice in the test.index file that's why  we get two console.log(keys)
    const keys = [
      ...new Set(
        translationIds.flatMap((value) => value).filter((value) => value !== "")
      ),
    ];

    for (const key of keys) {
      Object.assign(testObject, { [key]: { msgid: key, msgstr: [" "] } });
    }

    const potFile: gettextParser.GetTextTranslations = {
      headers: { header: "" },
      charset: "uft-8",
      translations: { [""]: testObject },
    };
    result.push(parseResource(potFile, "auto"));

    console.log(potFile, "testob");
  }
  for (const language of args.config.languages) {
    // filter the referenceLanguage out of all languages,
    // because the referencelanguage is an .pot file not a .po file
    let response;
    try {
      const resourcePath =
        args.pluginConfig.pathPattern.replace("{language}", language) + "t";
      response = (await args.$fs.readFile(resourcePath, "utf-8")) as string;
    } catch (error) {
      const resourcePath = args.pluginConfig.pathPattern.replace(
        "{language}",
        language
      );
      response = (await args.$fs.readFile(resourcePath, "utf-8")) as string;
    }

    // if (language === args.config.referenceLanguage) {
    //   // resourcePath =
    //   //   args.pluginConfig.pathPattern.replace("{language}", language) + "t";
    // } else {
    //   const resourcePath = args.pluginConfig.pathPattern.replace(
    //     "{language}",
    //     language
    //   );}
    const poFile = gettextParser.po.parse(response);
    result.push(parseResource(poFile, language));
    // console.log(poFile.translations[""], "po");
    // reading the po
  }
  console.log(result);
  return result;
}

// {
//   [1]   '': {
//   [1]     msgid: '',
//   [1]     msgstr: [
//   [1]       'Project-Id-Version: Prusa-Firmware\n' +
//   [1]         'POT-Creation-Date: Wed 16 Mar 2022 09:24:45 AM CET\n' +
//   [1]         'PO-Revision-Date: Wed 16 Mar 2022 09:24:45 AM CET\n' +
//   [1]         'Last-Translator: \n' +
//   [1]         'Language-Team: \n' +
//   [1]         'Language: es\n' +
//   [1]         'MIME-Version: 1.0\n' +
//   [1]         'Content-Type: text/plain; charset=utf-8\n' +
//   [1]         'Content-Transfer-Encoding: 8bit\n' +
//   [1]         'X-Generator: Poedit 2.0.7\n' +
//   [1]         'X-Poedit-SourceCharset: UTF-8\n' +
//   [1]         'Plural-Forms: nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;\n'
//   [1]     ]
//   [1]   },
//   [1]   ' 0.3 or older': { msgid: ' 0.3 or older', msgstr: [ ' 0.3 o mayor' ] },
//   [1]   ' 0.4 or newer': { msgid: ' 0.4 or newer', msgstr: [ ' 0.4 o mas nueva' ] },
//   [1]   '%s level expected': { msgid: '%s level expected', msgstr: [ '%s nivel esperado' ] }
//   [1] } po

// [
//   [1]   { ' 0.3 or older': { msgid: ' 0.3 or older', msgstr: [Array] } },
//   [1]   { ' 0.4 or newer': { msgid: ' 0.4 or newer', msgstr: [Array] } },
//   [1]   {
//   [1]     '%s level expected': { msgid: '%s level expected', msgstr: [Array] }
//   [1]   },
//   [1]   { test: { msgid: 'test', msgstr: [Array] } },
//   [1]   { 'new-message': { msgid: 'new-message', msgstr: [Array] } }
//   [1] ] testob

/**
 * Writing resources.
 *
 * The function merges the args from Config['readResources'] with the pluginConfig
 * and EnvironmentFunctions.
 */
export async function writeResources(
  args: Parameters<Config["writeResources"]>[0] &
    EnvironmentFunctions & { pluginConfig: PluginConfig }
): ReturnType<Config["writeResources"]> {
  for (const resource of args.resources) {
    const resourcePath = args.pluginConfig.pathPattern.replace(
      "{language}",
      resource.languageTag.name
    );
    const poFile = serializeResource(resource);
    const text = gettextParser.po.compile(poFile);
    await args.$fs.writeFile(resourcePath, text, { encoding: "utf-8" });
  }
}

/**
 * Parses a resource.
 *
 * @example
 *  parseResource({ "test": "Hello world" }, "en")
 */
function parseResource(
  poFile: gettextParser.GetTextTranslations,
  language: string
): ast.Resource {
  return {
    metadata: {
      headers: poFile.headers,
      charset: poFile.charset,
    },
    type: "Resource",
    languageTag: {
      type: "LanguageTag",
      name: language,
    },
    body: Object.values(poFile.translations[""])
      .filter((translation) => translation.msgid !== "")
      .map((translation) => parseMessage(translation)),
  };
}

/**
 * Parses a message.
 *
 * @example
 *  parseMessage("test", "Hello world")
 */
function parseMessage(
  translation: gettextParser.GetTextTranslation
): ast.Message {
  return {
    type: "Message",
    metadata: {
      comments: translation.comments,
    },
    id: {
      type: "Identifier",
      name: translation.msgid,
    },
    pattern: {
      type: "Pattern",
      elements: [{ type: "Text", value: translation.msgstr[0] }],
    },
  };
}

/**
 * Serializes a resource.
 *
 * The function unflattens, and therefore reverses the flattening
 * in parseResource, of a given object. The result is a stringified JSON
 * that is beautified by adding (null, 2) to the arguments.
 *
 * @example
 *  serializeResource(resource)
 */
function serializeResource(
  resource: ast.Resource
): gettextParser.GetTextTranslations {
  return {
    headers: (resource.metadata as any)
      .headers as gettextParser.GetTextTranslations["headers"],
    charset: (resource.metadata as any)
      .charset as gettextParser.GetTextTranslations["charset"],
    translations: {
      "": Object.fromEntries(
        resource.body.map((message) => {
          return [message.id.name, serializeMessage(message)];
        })
      ),
    },
  };
}

/**
 * Serializes a message.
 *
 * Note that only the first element of the pattern is used as inlang, as of v0.3,
 * does not support more than 1 element in a pattern.
 */
function serializeMessage(
  message: ast.Message
): gettextParser.GetTextTranslation {
  return {
    comments: message.metadata as gettextParser.GetTextComment,
    msgid: message.id.name,
    msgstr: [message.pattern.elements[0].value],
  };
}
