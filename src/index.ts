import express, { Express } from 'express';

import { setupDatabase } from './db';

const app: Express = express();
setupDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/hello', (_, res) => {
    res.send('hello');
});

app.listen(5001, () => {
    console.log('server started on localhost:5001');
});
