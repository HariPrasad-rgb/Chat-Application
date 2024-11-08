const generateMessage=(text,username)=>
{
    return {
        text,
        createdAt:new Date().getTime(),
        username
    }
}

const generateLocation=(url,username)=>
{
    return{
        url,
        createdAt:new Date().getTime(),
        username
    }
}


module.exports={
    generateMessage,
    generateLocation
}