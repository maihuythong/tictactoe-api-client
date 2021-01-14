
let quickPlay = [];

const pushUser = (user)=>{
    console.log("add quick");
    quickPlay.push(user);
}
const removeUser = (user) => {
    console.log("remove quick");
    if(!user) return;
    // for (let i = 0; i < quickPlay.length; i++)
    //     if (quickPlay[i].username === user.username) {
    //         quickPlay.splice(i, 1);
    //         break;
    //     }
    let filter = quickPlay.filter(item => {
        console.log(item.username !==user.username);
        return item.username !== user.username
    });
    quickPlay = filter;
  
}
const checkHaveMatch = (user) =>{
    if(!user) return null;
    for(let i =0; i< quickPlay.length;i++){
        if(checkMatch(user, quickPlay[i])){
            return{
                user1: user,
                user2: quickPlay[i]
            }
        }
    }
    return null;
}

const checkMatch = (user1,user2 ) =>{
    if(user1 && user2){
        if (Math.abs(user1.cup-user2.cup)<10 && user1.username!==user2.username){
            return true;
        }
    }
   return false;  
}

module.exports = {quickPlay: quickPlay, pushUser:pushUser, removeUser:removeUser, checkHaveMatch: checkHaveMatch};