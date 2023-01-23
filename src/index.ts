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
  // filter the referenceLanguage out of all languages,
  // because the referencelanguage is an .pot file not a .po file
  // !! for (const language of args.config.languages.filter(
  // (value) => value !== args.config.referenceLanguage
  // ))

  for (const language of args.config.languages) {
    const resourcePath = args.pluginConfig.pathPattern.replace(
      "{language}",
      language
    );
    // reading the po
    const po = gettextParser.po.parse(
      (await args.$fs.readFile(resourcePath, "utf-8")) as string
    );
    result.push(parseResource(po.translations[""], language));
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
  console.log(args.resources, "wo sthet was");
  for (const resource of args.resources) {
    const resourcePath = args.pluginConfig.pathPattern.replace(
      "{language}",
      resource.languageTag.language
    );

    await args.$fs.writeFile(resourcePath, serializeResource(resource));
  }
}

/**
 * Parses a resource.
 *
 * @example
 *  parseResource({ "test": "Hello world" }, "en")
 */
function parseResource(flatPo: any, language: string): ast.Resource {
  return {
    // metadata
    type: "Resource",
    languageTag: {
      type: "LanguageTag",
      language: language,
    },
    body: Object.entries(flatPo)
      .filter(([value]) => value !== "")
      .map(([id, value]) => parseMessage(id, value)),
  };
}

/**
 * Parses a message.
 *
 * @example
 *  parseMessage("test", "Hello world")
 */
function parseMessage(id: string, value: any): ast.Message {
  return {
    type: "Message",
    id: {
      type: "Identifier",
      name: id,
    },

    pattern: {
      type: "Pattern",
      elements: [
        { type: "Text", value: value.msgstr[0], metadata: value.comments },
      ],
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
function serializeResource(resource: ast.Resource): Buffer {
  const pol = Object.fromEntries(resource.body.map(serializeMessage));

  const translations = new Map([["", pol]]);
  const res = Object.fromEntries(translations);
  const resp = new Map([["translations", res]]);

  const poFile = new Map([
    ["charset", "utf-8"],
    ["header", undefined],
  ]);
  let po: any;
  //  !! data is not working
  // const data = [
  //   (po.charset = "uft-8"),
  //   (po.header = undefined),
  //   (po.translations = res),
  // ];
  // console.log(data, "data");

  const result = Object.fromEntries(poFile);
  const hope = Object.assign(result, Object.fromEntries(resp));
  var output = gettextParser.po.compile(hope);

  // stringyify the object with beautification.

  return output;
}

/**
 * Serializes a message.
 *
 * Note that only the first element of the pattern is used as inlang, as of v0.3,
 * does not support more than 1 element in a pattern.
 */
function serializeMessage(message: ast.Message): [id: string, value: any] {
  const poFile = new Map([
    ["msgid", message.id.name],
    ["comments", message.pattern.elements[0].metadata],
    ["msgstr", [message.pattern.elements[0].value]],
  ]);

  return [message.id.name, Object.fromEntries(poFile)];
}
