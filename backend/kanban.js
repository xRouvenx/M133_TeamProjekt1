import { Application, Router } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Task } from "./task.js";;

const app = new Application();
const router = new Router();

const tasks = [];
let id = 1;

router.get('/fetchTask', async function (context) {
    context.response.body = JSON.stringify(tasks);
    context.response.status = 200;
});

router.post('/addTask', async (context) => {
    const body = JSON.parse(await context.request.body().value);
    const task = new Task();
    task.name = body.name;
    task.state = body.state;
    task.id = id;
    tasks.push(task);
    id++;
    // remove next line
    console.log(tasks);
    context.response.status = 201;
});

router.put('/moveTask', async (context) => {
    const body = JSON.parse(await context.request.body().value);
    const task = tasks.find(function (task) {
        return task.id == body.id;
    });
    task.state = body.state;
    context.response.status = 200;
});

app.use(oakCors());

app.use(router.routes());

await app.listen({ port: 8000 });