// import User from '../models/user';
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const socket = (io) => {
module.exports = (io) => {

    io.on('connection', (socket) => {
        socket.on('login', async (token) => {
            const decodedToken = await verifyToken(token.token);
            // handle case facebook, google (not username) ...
            const id = await (await User.findOne({username: decodedToken.username}))._id;
            if(decodedToken){
                const doc = await User.findOneAndUpdate({_id: id}, {status: 'online'}, {"new": true, useFindAndModify: false})
                if(doc){
                    const listOnline = await User.find({status: 'online'});
                    io.emit("list", {data: listOnline});
                }
            }
        });

        socket.on('logout', async (token) => {
            const decodedToken = await verifyToken(token.token);
            // handle case facebook, google (not username) ...
            const id = await (await User.findOne({username: decodedToken.username}))._id;
            if(decodedToken){
                const doc = await User.findOneAndUpdate({_id: id}, {status: 'offline'}, {"new": true, useFindAndModify: false})
                if(doc){
                    const listOnline = await User.find({status: 'online'});
                    io.emit("list", {data: listOnline});
                }
            } 
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

// export default socket;