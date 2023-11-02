import server from "./Api/Server.js";

const port = 5000;

server.listen(port, () =>{
    console.log(`port starting http://localhost:${port}`);
});