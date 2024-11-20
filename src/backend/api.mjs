import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello world!');
});
  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});