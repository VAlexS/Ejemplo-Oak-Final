import { RouterContext } from "oak/router.ts";
import { eventosCollection } from "../db/conexiondb.ts";
import { ObjectId } from "mongo";

type PutEventoCtx = RouterContext<
    "/updateEvent",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

export const updateEvento = async (ctx: PutEventoCtx): Promise<void> => {
    try{
        //paso los datos a traves del body de json
        const result = ctx.request.body({type: "json"});
        const value = await result.value;
        

        if(!value?.titulo && !value?.fecha && !value?.inicio && !value?.final && !value?.invitados){
            ctx.response.body = {mensaje: "Te faltan datos por definir"};
            ctx.response.status = 400;
            return;
        }


        

       //aunque haya que meter todos los datos, si no se especifica alguno, no se modifica
        



        const eseEvento = await eventosCollection.findOne({_id: new ObjectId(value.id)});
        if(!eseEvento){
            ctx.response.body = {mensaje: "Evento no encontrado"};
            ctx.response.status = 404;
            return;
        }


        const inicio = value.inicio;
        const final = value.final;
        if(final <= inicio){
            ctx.response.body = {mensaje: "La hora de inicio y la hora de fin no son coherentes"};
            ctx.response.status = 400;
            return;
        }

        await eventosCollection.updateOne(
            {_id: eseEvento._id},
            {$set: {
                titulo: value.titulo, 
                descripcion: value.descripcion,
                fecha: new Date(value.fecha),
                inicio: inicio,
                final: final,
                invitados: value.invitados,
                }
            }
        );


        const eventoModificado = await eventosCollection.findOne({_id: eseEvento._id});

        if(!eventoModificado){
            ctx.response.status = 404;
            return;
        }

        const anio = eventoModificado.fecha.getFullYear();
        const mes = eventoModificado.fecha.getMonth() + 1;
        const dia = eventoModificado.fecha.getDate();

        const fecha = anio.toString().concat("-").concat(mes.toString()).concat("-").concat(dia.toString());



        ctx.response.body = {
            id: eventoModificado._id.toString(),
            titulo: eventoModificado.titulo,
            descripcion: eventoModificado.descripcion,
            fecha: fecha,
            inicio: eventoModificado.inicio,
            final: eventoModificado.final,
        };

        ctx.response.status = 200;


        
    }catch(e){
        console.error(e);
        ctx.response.status = 500;
    }
};