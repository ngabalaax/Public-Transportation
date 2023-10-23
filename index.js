import server from "./Api/Server";

const port = 5000;

server.listen(port, () =>{
    console.log(`port starting http://localhost:${port}`);
});