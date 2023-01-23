import { defineConfig } from "../inlang.config.js";
import { describe, it, expect } from "vitest";
import nodeFs from "node:fs";
import { fs as memfs } from "memfs";
import {
  initialize$import,
  Config,
  EnvironmentFunctions,
} from "@inlang/core/config";
import { query } from "@inlang/core/query";

const env = await initializeTestEnvironment();
const config: Config = await defineConfig(env);

describe("plugin", async () => {
  const resources = await config.readResources({ config });
  const referenceResource = resources.find(
    (resource) => resource.languageTag.name === config.referenceLanguage
  )!;

  describe("readResources()", async () => {
    it("should return an array of resources that matches config.languages", () => {
      expect(resources.length).toBe(config.languages.length);
      for (const resource of resources) {
        expect(config.languages.includes(resource.languageTag.name));
      }
    });

    it("should be possible to query a message", () => {
      const message = query(referenceResource).get({ id: "test" });
      expect(message).toBeDefined();
      expect(message?.pattern.elements[0].value).toBe(
        "This message is used for testing purposes."
      );
    });
  });

  describe("writeResources()", async () => {
    it("should serialize the resources", async () => {
      const updatedReferenceResource = query(referenceResource)
        .create({
          message: {
            id: { type: "Identifier", name: "new-message" },
            type: "Message",
            pattern: {
              type: "Pattern",
              elements: [{ type: "Text", value: "Newly created message" }],
            },
          },
        })
        .unwrap();
      const updatedResources = [
        ...resources.filter(
          (resource) => resource.languageTag.name !== config.referenceLanguage
        ),
        updatedReferenceResource,
      ];
      await config.writeResources({ config, resources: updatedResources });

      const response = await config.readResources({ config });

      console.log(response);

      const testResource = response.find(
        (resource) => resource.languageTag.name === "en"
      );
      if (testResource === undefined) {
        throw Error("reference resource not found");
      }
      const message = query(referenceResource).get({ id: "new-message" });
      expect(message?.pattern.elements[0].value).toBe("Newly created message");
    });
  });
});

/**
 * Initializes the environment.
 *
 * Copies files in /dist and /example to the in-memory file system.
 */
async function initializeTestEnvironment(): Promise<EnvironmentFunctions> {
  const $fs = memfs.promises;

  // change the working directory to the inlang config directory to resolve relative paths
  process.cwd = () => "/";
  const $import = initialize$import({
    workingDirectory: "/",
    fs: $fs,
    fetch,
  });

  const env = {
    $fs,
    $import,
  };

  const copyDirectory = async (path: string) => {
    // create directory
    await $fs.mkdir(path, { recursive: true });

    for (const file of await nodeFs.promises.readdir("./" + path)) {
      const isFile = file.indexOf(".") > -1;
      if (isFile) {
        await $fs.writeFile(
          `${path}/${file}`,
          await nodeFs.promises.readFile(`./${path}/${file}`, "utf-8"),
          { encoding: "utf-8" }
        );
      } else {
        await copyDirectory(`${path}/${file}`);
      }
    }
  };

  // only /dist and /example are needed and therefore copied
  for (const path of ["/dist", "/example"]) {
    await copyDirectory(path);
  }

  return env;
}
