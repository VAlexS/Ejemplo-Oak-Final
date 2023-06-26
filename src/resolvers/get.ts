import { RouterContext } from "oak/router.ts";
import { eventosCollection } from "../db/conexiondb.ts";
import { ObjectId } from "mongo";

type GetEventosCtx = RouterContext<
    "/events",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

type GetEventoCtx = RouterContext<
    "/event/:id",
    {
        id: string;
    } & Record<string | number, string | undefined>,
    Record<string, any>
>;

export const getEventos = async (ctx: GetEventosCtx): Promise<void> => {
    try{
        const todosLosEventos = await eventosCollection.find({}).toArray();
        const eventos = todosLosEventos.map((evento) => {

            const anio = evento.fecha.getFullYear();
            const mes = evento.fecha.getMonth() + 1;
            const dia = evento.fecha.getDate();

            const fecha = anio.toString().concat("-").concat(mes.toString()).concat("-").concat(dia.toString());
            return {
                id: evento._id.toString(),
                titulo: evento.titulo,
                descripcion: evento.descripcion,
                fecha: fecha,
                inicio: evento.inicio,
                final: evento.final,
                invitados: evento.invitados,
            }
        });

        ctx.response.body = eventos;
        ctx.response.status = 200;


    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};

export const getEvento = async (ctx: GetEventoCtx): Promise<void> => {
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

        const anio = evento.fecha.getFullYear();
        const mes = evento.fecha.getMonth() + 1;
        const dia = evento.fecha.getDate();

        const fecha = anio.toString().concat("-").concat(mes.toString()).concat("-").concat(dia.toString());

        ctx.response.body = {
            id: evento._id.toString(),
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            fecha: fecha,
            inicio: evento.inicio,
            final: evento.final,
            invitados: evento.invitados,
        }


    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};