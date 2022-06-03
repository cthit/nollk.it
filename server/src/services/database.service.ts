import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import Pateter from "../models/pateter";

// Global variables
export const collections: { nollkit?: mongoDB.Collection<Pateter> } = {}

// Initialize connection
export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    await db.command({
        "collMod": process.env.PATETER_COLLECTION_NAME,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "year", "imageDesc", "members"],
                additionalProperties: false,
                properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                year: {
                    bsonType: "string",
                    description: "'year' is required and is a string"
                },
                imageDesc: {
                    bsonType: "string",
                    description: "'imageDesc' is required and is a string"
                },
                members: {
                    bsonType: "array",
                    description: "'members' is required and is an array",
                    items: {
                        bsonType: "object",
                        required: ["name", "role"],
                        additionalItems: false,
                        properties: {
                            name: {
                                bsonType: "string",
                                description: "'name' is name of person and is a string"
                            },
                            role: {
                                bsonType: "string",
                                description: "'role' is the role the person has and is a string"
                            }
                        }
                    }
                }
                }
            }
        }
    });
   
    const nollkitCollection: mongoDB.Collection<Pateter> = db.collection<Pateter>(process.env.PATETER_COLLECTION_NAME);
 
    collections.nollkit = nollkitCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${nollkitCollection.collectionName}`);
 }