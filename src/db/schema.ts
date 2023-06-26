import { ObjectId } from "mongo";
import { Evento } from "../types.ts";

export type EventoSchema = Omit<Evento, "id" | "fecha"> & {
    _id: ObjectId;
    fecha: Date;
}