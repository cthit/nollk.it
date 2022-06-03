import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Pateter from "../models/pateter";

export const pateterRouter = express.Router();

pateterRouter.use(express.json());

pateterRouter.get("/", async (req: Request, res: Response) => {
    try {
        const pateters = (await collections.nollkit.find({}).toArray()) as Pateter[];
        res.status(200).send(pateters);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

pateterRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const pateter = (await collections.nollkit.findOne(query) as Pateter);

        if (pateter) {
            res.status(200).send(pateter);
        }

    } catch (error) {
        res.status(404).send(`Unable to find pateter with id: ${id}`);
    }
});

pateterRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newPateter = req.body as Pateter;
        const result = await collections.nollkit.insertOne(newPateter);

        result
            ? res.status(201).send(`Successfully created new year with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new year.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

pateterRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedPateter: Pateter = req.body as Pateter;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.nollkit.updateOne(query, { $set: updatedPateter });

        result
            ? res.status(200).send(`Successfully updated pateter with id ${id}`)
            : res.status(304).send(`Pateter with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});


pateterRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.nollkit.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed pateter with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove pateter with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Pateter with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});