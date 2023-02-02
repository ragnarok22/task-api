import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

import { readFileSync } from "fs";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

import { Resolvers } from "./generated/graphql";
import { queries } from "./queries.js";
import * as mutations from "./mutations";

const firebaseConfig = {
    apiKey: ""
}

initializeApp(firebaseConfig)

const typeDefs = readFileSync('./schema.graphql', { encoding: "utf-8" });

export const resolvers = {
    Query: {
        tasks: queries.getTasks
    }
}

const app = express()
const httpServer = http.createServer(app)
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start()

app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
);

const port = 4040;

await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
console.log(`Server ready at http://localhost:${port}`);
