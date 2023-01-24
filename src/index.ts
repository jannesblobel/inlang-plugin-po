import type { Config, EnvironmentFunctions } from "@inlang/core/config";
import type * as ast from "@inlang/core/ast";
import gettextParser from "gettext-parser";

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

  // !!
  // for (const language of args.config.languages.filter(
  // (value) => value !== args.config.referenceLanguage
  // ))

  for (const language of args.config.languages) {
    // filter the referenceLanguage out of all languages,
    // because the referencelanguage is an .pot file not a .po file
    let resourcePath;
    if (language === args.config.referenceLanguage) {
      try {
        resourcePath =
          args.pluginConfig.pathPattern.replace("{language}", language) + "t";
        await args.$fs.readFile(resourcePath, "utf-8");
      } catch (error) {
        console.log(error, "no .pot file found");
        resourcePath = args.pluginConfig.pathPattern.replace(
          "{language}",
          language
        );
      }
    } else {
      resourcePath = args.pluginConfig.pathPattern.replace(
        "{language}",
        language
      );
    }
    // reading the po
    const poFile = gettextParser.po.parse(
      (await args.$fs.readFile(resourcePath, "utf-8")) as string
    );
    result.push(parseResource(poFile, language));
  }
  return result;
}

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
