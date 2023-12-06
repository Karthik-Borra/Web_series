const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
let r_Data;
let DB_NAME = "web-series-info";
let C_NAME = "web-series-info"
async function main() {
    const uri = `mongodb+srv://karthik:Lord123@cluster0.h0riy2q.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
    } finally {
        await client.close();
    }
}


main().catch(console.error);

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });    
        const uri = `mongodb+srv://karthik:Lord123@cluster0.h0riy2q.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            r_Data = await getMongoData(client)
            res.end(JSON.stringify(r_Data))
        } finally {
            await client.close();
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

async function getMongoData(client) {
    const cursor = client.db(DB_NAME).collection(C_NAME)
        .find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        return results;
    } else {}
}
const PORT = process.env.PORT || 8475;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));
