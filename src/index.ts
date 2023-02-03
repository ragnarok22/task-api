import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { initializeApp } from "firebase/app";

import { readFileSync } from "fs";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

import { Resolvers } from "./generated/graphql";
import { queries } from "./queries.js";
import { mutations } from "./mutations.js";

const firebaseConfig = {
    apiKey: "AIzaSyCoo7Lg_VPMjvLUPuGftJAWSmQBowOg5gM",
    authDomain: "task-api-2023.firebaseapp.com",
    projectId: "task-api-2023",
    storageBucket: "task-api-2023.appspot.com",
    messagingSenderId: "1038949165007",
    appId: "1:1038949165007:web:79847bb7c59b72a44994ba"
}

initializeApp(firebaseConfig)

const typeDefs = readFileSync('./schema.graphql', { encoding: "utf-8" });

export const resolvers = {
    Query: {
        tasks: queries.getTasks,
        task: queries.getTaskById,
    },
    Mutation: {
        addTask: mutations.addTask,
        removeTask: mutations.removeTask,
        updateTask: mutations.updateTask,
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
