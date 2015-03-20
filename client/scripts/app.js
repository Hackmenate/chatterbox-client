(function(){

	window.app = {
		existingRooms:[],
		server: 'https://api.parse.com/1/classes/chatterbox',
		init: function(){

		},
		send: function(data){
			$.ajax({
			  url: app.server,
			  type: 'POST',
			  data: JSON.stringify(data),
			  contentType: 'application/json',
			  success: function (data) {
			  	app.fetch()
			    console.log('chatterbox: Message sent');
			  },
			  error: function (data) {
			    console.error('chatterbox: Failed to send message');
			  }
			});
		},

		fetch: function(){
			$.ajax({
			  url: app.server,
			  type: 'GET',
			  data: {'order': '-createdAt'},
			  contentType: 'application/json',
			  success: function (data) {
			  	console.log(data)
			    
			  	app.populateMessages(data)
			  	app.populateRooms(data)
			  
			  },
			  error: function (data) {
			    console.error('chatterbox: Failed to retrieve');
			  }
			});
		},

		populateMessages: function(data){
			app.clearMessages()

			for (var i=0;i<data.results.length;i++){
			    	if (data.results[i].roomname===$("#roomSelect option:selected").text()){
			    		app.addMessage(data.results[i])
			    	}
			    }
		},

		clearMessages: function(message){
			$("#chats").empty()
		},

		addMessage: function(message){
			var user = message.username
			var chat = "<div class='chat'><div class='username "+user+"'>"+user+"</div><div class='text'>"+message.text+"</div></div>"
			$("#chats").append(chat)
		},

		populateRooms:function(data){
			  var rooms=[]

			    for (var i=0;i<data.results.length;i++){
			    	rooms.push(data.results[i].roomname)
			    }
			    
			    for (var i=0;i<rooms.length;i++){
		    		if (app.existingRooms.indexOf(rooms[i]) ===-1){
				    	app.addRoom(rooms[i])
				    	app.existingRooms.push(rooms[i])		    		
		    		}
			    }

		},

		addRoom: function(rooms){
			$("#roomSelect").append("<option>"+rooms+"</option>")
		},

		addFriend: function(context){
			var classHolder=$(context).attr('class').split(" ")
			$("."+classHolder[1]).addClass("friend")
		},

		submitHandler: function(e){
			var userName = window.location.href.split('username=')[1];
			var message = {
				username: userName.slice(0,-1),
				text:$("#message").val(),
				roomname:$("#roomSelect option:selected").text()
			}
			app.send(message)
			e.preventDefault()
		}
	}

app.fetch()
setInterval(function(){app.fetch()},3000)

	$(document).ready(function(){

		$(document).on('click', '.username', function(){
			var context=this
			app.addFriend(context)
		})

		$(".submit").click(function(){
			app.submitHandler()	
		})

		$("#roomSelect").change(function(){
				app.fetch()
			});
		
	})

})();



