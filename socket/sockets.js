// import User from '../models/user';
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const socket = (io) => {
module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('login', async (token) => {
            const decodedToken = await verifyToken(token.token);
            // handle case facebook, google (not username) ...
            const id = await (await User.findOne({username: decodedToken.username}))._id;   
            if(decodedToken){
                const doc = await setStatus(id,'online');
                if(doc){
                    const listOnline = await User.find({status: 'online'});
                    io.emit("list", listOnline);
                }
            }
        });

        socket.on('logout', async (token) => {
            const decodedToken = await verifyToken(token.token);
            // handle case facebook, google (not username) ...
            const id = await (await User.findOne({username: decodedToken.username}))._id;
            if(decodedToken){
                const doc = await setStatus(id,'offline');
                if(doc){
                    const listOnline = await User.find({status: 'online'});
                    io.emit("list", listOnline);
                }
            } 
        })
        socket.on('disconnect', (token)=> {
            console.log('disconnect');
        })
    });
};


const verifyToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (e){
        return false;
    }
}

const setStatus = async (id, status) => {
    return await User.findOneAndUpdate({ _id: id }, { status: status }, { "new": true, useFindAndModify: false });
}

// export default socket;