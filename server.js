const express = require('express');
const app = express();
const http = require('http');
const path = require('path');


const server = http.createServer(app);

app.get('/healthz', (req, res) => {
    res.status(200).json({ ok: true });
});

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('./client/build'));
    app.use((req, res, next) => {
        res.sendFile(path.join(__dirname, './client/build', 'index.html'));
    });
    
}

const io=require('socket.io')(server,{
     cors:{
        origin:'*',
        methods:["GET","POST"]
    }
})

const Document=require('./Document')
const mongoose=require('mongoose');

const db = process.env.MONGODB_URI;
if (!db) {
    console.error('MONGODB_URI is required');
    process.exit(1);
}

mongoose.connect(db).then(()=>console.log("DB Connected!")).catch((err)=>console.log(err));


// what happens when user joins

//get all connected clients of room
const userSocketMap = {};
function getAllConnectedClients(fileId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(fileId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

// when io is connected
io.on("connection", socket =>{
    
    
    // if socket receives join signal (someone joined)
    
    socket.on('join', ({ fileId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(fileId);
        const clients = getAllConnectedClients(fileId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });
    
    console.log('connected!')


    socket.on('get-file',async fileId=>{
        const document= await findOrCreateFile(fileId);
        socket.join(fileId);
        socket.emit('load-file',document.data);
        socket.on('send-changes',text=>{
            //console.log(text);
            socket.broadcast.to(fileId).emit('receive-changes',text);
        })

        socket.on('save-file',async data=>{
            await Document.findByIdAndUpdate(fileId,{data})

        })
    })

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        
        rooms.forEach((fileId) => {
            socket.in(fileId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
        console.log('left!!')
    });
})


const defaultValue="";

async function findOrCreateFile(id){
    if(id==null)return;
    //console.log(id);
    const document=await Document.findById(id);
    if(document) return document;
    return await Document.create({_id:id,data:defaultValue})

}


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
