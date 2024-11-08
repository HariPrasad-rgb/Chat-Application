let users=[]

const addUser=({id,username,room})=>{

    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username || !room)
    {
        return {
            error:'Username and room are required'
        }
    }
  
    //check for existing user
    const existinguser=users.find((user)=>
    {
        return user.username===username && user.room===room
    })
    
    //validate username
    if(existinguser)
    {
        return{
            error:'user already exists'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return {user}
}

//remove user
const removeUser=(id)=>
{
    const user=users.find((user)=>
    {
        return user.id===id
    })
    if(!user)
    {
        return{
            error:'No such user exists'
        }
    }
    const updatedUsers=users.filter((user)=>{
        return user.id!==id
    })

    users=updatedUsers
    return user
}

//getUser
const getUser=(id)=>{
    
    const user=users.find((user)=>
    {
        return user.id===id
    })
    if(!user)
    {
        return{
            error:'No such user exists'
        }
    }
    return user

    console.log('user is ',user)
}

//getUsersinaroom

const getUsersInRoom=(room)=>{
    const pps=users.filter((user)=>{
        return user.room===room
    })
    if(!users)
    {
        return{
            error:"No users in this room"
        }
    }
    return pps
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
