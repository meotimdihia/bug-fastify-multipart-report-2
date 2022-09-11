import { FastifyPluginAsync } from "fastify";

// import { MultipartFile } from "@fastify/multipart";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    reply.type("text/html");
    return `
    <html>
    
      <body>
        <form action="/" method='POST' enctype='multipart/form-data'>
          <input name='images' multiple type='file' />
          <input name='authors' type='text' required />
          <input type='submit' value='submit' />
        </form>
      </body>
    </html>
  
  `;
  });
  type IBody = {
    authors: string[];
  };

  const body = {
    type: "object",
    properties: {
      authors: {
        type: "array",
      },
      images: {
        type: "array",
        items: fastify.getSchema("mySharedSchema"),
        minItems: 1,
        maxItems: 400,
      },
    },
    additionalProperties: true,
  };

  fastify.post<{ Body: IBody }>(
    "/",
    {
      schema: {
        body: body,
      },
    },
    async (req, reply) => {
      return { authors: req.body.authors };
    }
  );
};

export default root;
