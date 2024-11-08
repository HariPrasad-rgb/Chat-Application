const socket=io()

//Elements
const $messageform=document.querySelector('#message-form')
const $messageformInput=$messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')
const $sendlocatiobutton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')


//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options
const{username,room}=Qs.parse(location.search,{
  ignoreQueryPrefix:true
})
console.log(username,room)

const autoscroll=()=>
{
  //new message element
  const $newMessage=$messages.lastElementChild
  
  //height of new message
  const newMessageStyles=getComputedStyle($newMessage)
  const newMessageMargin=parseInt(newMessageStyles.marginBottom)
  const newmessageHeight=$newMessage.offsetHeight+newMessageMargin
  console.log(newMessageMargin)

  //visible height
  const visibleheight=$messages.offsetHeight

  //height of message container
  const conatinerHeight=$messages.scrollHeight
  //how far i have scrolled
  const scrolloffset=$messages.scrollTop+visibleheight
  if(conatinerHeight-newmessageHeight<=scrolloffset)
  {
    $messages.scrollTop=$messages.scrollHeight
  }
}

socket.on('locationMessage',(message)=>{
  const html=Mustache.render(locationTemplate,{
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm a'),
    username:message.username
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('message',(message)=>
{
  console.log(message)
    const html=Mustache.render(messageTemplate,{
      createdAt:moment(message.createdAt).format('h:mm a'),
      message:message.text,
      username:message.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('roomdata',({room,users})=>
{
 const html= Mustache.render(sidebarTemplate,{
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML=html
})

$messageform.addEventListener('submit',(e)=>
{
    e.preventDefault()
    $messageformbutton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value
    $messageformInput.value=''
    $messageformInput.focus()
    
    socket.emit('sendMessage',message,(error)=>{
        $messageformbutton.removeAttribute('disabled')
        if(error)
        {
            return alert(error)
        }
        console.log("the message was delivered")
    })
   
})

$sendlocatiobutton.addEventListener('click',()=>
{
   if(!navigator.geolocation)
   {
      return alert('Geolocation is not supported by your browser')
   }

   navigator.geolocation.getCurrentPosition((position)=>
   {
    $sendlocatiobutton.setAttribute('disabled','disabled')
      const latitude=position.coords.latitude
      const longitude=position.coords.longitude
      const obj={
        latitude,longitude
      }
    
      socket.emit('sendLocation',obj,(message)=>
      {
        $sendlocatiobutton.removeAttribute('disabled')
      })
   })

})

socket.emit('join',{username,room},(error)=>
{
  if(error)
  {
    alert(error)
    location.href='/'
  }
})


