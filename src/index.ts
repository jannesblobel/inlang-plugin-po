import type { Config, EnvironmentFunctions } from "@inlang/core/config";
import type * as ast from "@inlang/core/ast";
import gettextParser, { GetTextTranslation } from "gettext-parser";
import { query } from "@inlang/core/query";

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
  referenceResourcePath: string | null;
};

export async function getLanguages(
  // merging the first argument from config (which contains all arguments)
  // with the custom pluginConfig argument
  args: EnvironmentFunctions & {
    pluginConfig: PluginConfig;
    referenceLanguage: string;
  }
) {
  // splitting a path like "resources/{language}.po" will always return an array with two elements
  // namely before and after {language}
  const [pathBeforeLanguage, pathAfterLanguage] =
    args.pluginConfig.pathPattern.split("{language}");

  const pathAfterLanguageisDirectory = pathAfterLanguage.startsWith("/");

  // letzte index of /     //+1 so that '/' is not taken away from the Path

  const paths = await args.$fs.readdir(pathBeforeLanguage);

  //
  const languages = args.pluginConfig.referenceResourcePath
    ? []
    : [args.referenceLanguage];

  for (const language of paths) {
    if (pathAfterLanguageisDirectory) {
      const files = await args.$fs.readdir(
        pathBeforeLanguage +
          language +
          pathAfterLanguage.substring(0, pathAfterLanguage.lastIndexOf("/") + 1)
      );
      // somtime are more than 1 file in the folder example: messages.mo and messages.po

      for (const file of files) {
        if (typeof file === "string" && file.endsWith(".po")) {
          //if the
          languages.push(language as string);
        }
      }
    } else {
      if (typeof language === "string" && language.endsWith(".po")) {
        languages.push(language.replace(".po", ""));
      } else if (typeof language === "string" && language.endsWith(".pot")) {
        languages.push(language.replace(".pot", ""));
      }
    }
  }

  return languages;
}
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
  const resources: ast.Resource[] = [];

  // Action:     this .filter funciton in the forEach expression , filters the referenceLanguage from the array of all languages retrieved by the getLanguages function.
  // Reason:    because it could be that the reference language is a ".pot" file instead of a ".po" file and we do not want to overwrite a ".pot" or the reference language,
  //            because the "msgid" in this file is in most cases the ID for all other ".po" files.
  for (const language of args.config.languages.filter(
    (lang) => lang !== args.config.referenceLanguage
  )) {
    // Action:  replace the word {language} witch could means the languagecode from pathPattern with the languageCode
    // Reason: each language is saved in its own file or folder
    const resourcePath = args.pluginConfig.pathPattern.replace(
      "{language}",
      language
    );
    const poFile = gettextParser.po.parse(
      (await args.$fs.readFile(resourcePath, "utf-8")) as string
    );
    resources.push(parseResource(poFile, language));
  }

  // Action:  if a resource file exists, it will be read and processed in a usual way
  // Reason:  split off from the others because of the overwriting problem described above.
  if (args.pluginConfig.referenceResourcePath) {
    const poFile = gettextParser.po.parse(
      (await args.$fs.readFile(
        args.pluginConfig.referenceResourcePath,
        "utf-8"
      )) as string
    );
    resources.push(parseResource(poFile, args.config.referenceLanguage));
  }

  // Action: Create a ".pot" file if no ".pot" file exists. The ".pot" file would be created from all ".po" files found.
  //         This ".pot" file only exists for inlang and is not committed to the project/repo.
  // Reason: Ensure that all "msgID"s will are found and if nessesary created missing "msgID"s in other ".po"files
  else {
    // drop "msgID" duplicates with set and create a ".pot" file without duplicate IDs
    const ids = [
      ...new Set(
        resources.flatMap((resource) => query(resource).includedMessageIds())
      ),
    ];
    const potFile: gettextParser.GetTextTranslations = {
      headers: { header: "" },
      charset: "",
      translations: {
        [""]: Object.fromEntries(
          ids.map((id) => [
            id,
            {
              msgid: id,
              msgstr: [id],
            },
          ])
        ),
      },
    };
    resources.push(parseResource(potFile, args.config.referenceLanguage));
  }

  return resources;
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
    // dont write generated reference resource to file system
    if (
      args.pluginConfig.referenceResourcePath === null &&
      resource.languageTag.name === args.config.referenceLanguage
    ) {
      continue;
    }
    // if reference resource, the path differs. thus, take path from plugin config.
    const resourcePath =
      resource.languageTag.name === args.config.referenceLanguage
        ? args.pluginConfig.referenceResourcePath
        : args.pluginConfig.pathPattern.replace(
            "{language}",
            resource.languageTag.name
          );
    const poFile = serializeResource(resource);
    const text = gettextParser.po.compile(poFile);
    if (resourcePath) {
      await args.$fs.writeFile(resourcePath, text, { encoding: "utf-8" });
    }
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
    comments: message.metadata?.comments as gettextParser.GetTextComment,
    msgid: message.id.name,
    msgstr: [message.pattern.elements[0].value],
  };
}
