import express from 'express';
import configure from './configure';
import router from './router';

import headerMiddleware from '../src/policies/validate-header';

const app = express();
configure(app);

app.use(headerMiddleware);
router(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { port } = app.get('config');

app.listen(port, () => console.log('Listening on port %s', port));

export default app;
