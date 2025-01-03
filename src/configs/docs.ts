export const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Booksdotcom Express API with Swagger",
        version: "1.0.0",
        description:
          "Booksdotcom API application built in Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        }
      },
      servers: [
        {
          url: "https://booksdotcom.onrender.com",
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };
  