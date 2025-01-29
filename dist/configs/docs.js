"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
exports.options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Booksdotcom Express API with Swagger",
            version: "1.0.0",
            description: "Booksdotcom API application built in Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            }
        },
        servers: [
            {
                url: "http://localhost:4001/api/v1",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
