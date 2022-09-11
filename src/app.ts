import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import fastifyMultipart from "@fastify/multipart";

export type AppOptions = {
  // Place your custom options for app below here.
  bodyLimit: 100000000;
  ajv: {
    customOptions: {
      removeAdditional: true;
      useDefaults: true;
      coerceTypes: "array"; // This line
      allErrors: true;
      allowUnionTypes: true;
    };
  };
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
    sharedSchemaId: "#mySharedSchema",
    // onFile,
    limits: {
      fieldNameSize: 10000, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 100, // Max number of non-file fields
      fileSize: 100000000, // For multipart forms, the max file size in bytes
      files: 1000, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  });
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app };
