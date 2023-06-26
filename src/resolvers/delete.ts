import { RouterContext } from "oak/router.ts";
import { eventosCollection } from "../db/conexiondb.ts";
import { ObjectId } from "mongo";

type DeleteEventoCtx = RouterContext<
    "/deleteEvent/:id",
    {
        id: string;
    } & Record<string | number, string | undefined>,
    Record<string, any>
>;

export const deleteEvento = async (ctx: DeleteEventoCtx): Promise<void> => {
    try{
        const id = ctx.params.id;
        if(!id){
            ctx.response.body = {mensaje: "Tienes que especificar el id en el endpoint"};
            ctx.response.status = 400;
            return;
        }

        const evento = await eventosCollection.findOne({_id: new ObjectId(id)});
        
        if(!evento){
            ctx.response.body = {mensaje: "Evento no encontrado"};
            ctx.response.status = 404;
            return;
        }

        await eventosCollection.deleteOne({_id: evento._id});
        ctx.response.body = {mensaje: "El evento se ha eliminado correctamente"};
        ctx.response.status = 200;

    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};
