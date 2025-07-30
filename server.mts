import http from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    const parsedUrl = parse(req.url ?? '', true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000, () => {
    console.log(`> Server running on http://localhost:${process.env.PORT || 3000}`);
  });
});
