import { Application, Router } from "oak";

import { addEvento } from "./resolvers/post.ts";
import { getEvento, getEventos } from "./resolvers/get.ts";
import { updateEvento } from "./resolvers/put.ts";
import { deleteEvento } from "./resolvers/delete.ts";

const router = new Router();

router
    .post("/addEvent", addEvento)
    .get("/events", getEventos)
    .get("/event/:id", getEvento)
    .delete("/deleteEvent/:id", deleteEvento)
    .put("/updateEvent", updateEvento);




const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
    
//obtengo el puerto del .env
const port = Number(Deno.env.get("PORT"));
    
await app.listen({port: port});
