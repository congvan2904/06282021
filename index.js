var express=require('express')
var app=express()
const httpServer=require('http').createServer(app)
const io=require('socket.io')(httpServer)
httpServer.listen(process.env.PORT||3000)

app.set('view engine','ejs')

app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
	res.render('home')
})
var listUser=[]
io.on('connection',socket=>{
	console.log('id '+socket.id)
	socket.on('client-send-user-to-server',data=>{
		var find1=listUser.findIndex(e=>e.data===data)
		console.log(find1)
		if(find1>=0){
			socket.emit('server-send-existname-to-client')
		}
		else{
			socket.name=data
			listUser.push({data:data,id:socket.id})
			io.sockets.emit('server-send-alluser-to-client',{lUser:listUser,name:data})
		}
	})
	socket.on('client-send-buzz-to-server',data=>{
		io.to(data).emit('server-send-buzz-to-client',{name:socket.name})
	})
	socket.on('client-send-logout-to-server',()=>{
		 listUser=listUser.filter(e=>e.data!==socket.name)
		// console.log(newListUser)
		socket.broadcast.emit('server-send-logout-to-client',{name:socket.name,newList:listUser})
	})
	socket.on('client-send-focusinInputChat-to-server',()=>{
		socket.broadcast.emit('server-send-userFocusinInputChat-to-client')
	})
	socket.on('client-send-focusoutInputChat-to-server',()=>{
		socket.broadcast.emit('server-send-userFocusoutInputChat-to-client')
	})
})
