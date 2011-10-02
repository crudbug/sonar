var config = {
  me : $.cookie("me") || "me",
  room : "NYHack"
};

$(function(){
  socket = io.connect("/");

  socket.on("connect",function(){
    console.log("started");
    joinRoom(config.room);
  });

  socket.on("join room",function(data){
    console.log("updating users");
    console.log(data.messages);
    _.each(data.messages,function(message){
      addMessage(message) 
    });
    updateUsers(data.users);
  });

  socket.on("feeds",function(data){
    process_it(data);
  });

  $("#say").live('keypress', function(event){
    var data = $(event.target).val();
    
    if(event.which == 13){
      sendMessage({
        data:data
      })
      event.preventDefault();
    }
  });
});

function joinRoom(room){
  var previous = config.room;
  config.room = room;
  console.log("joining "+ room);

  socket.on("message",function(data){
    console.log(data);
    addMessage(data);
  });

  socket.emit("join",{
    name: config.me,
    room: config.room,
    previous: previous
  });

  updateRoom(room);
}

function updateUsers(users){
  var avatars = $("#avatars");
  avatars.empty();
  _.each(users,function(user){
    avatars.append("<li>"+ user +"</li>");
  });
}

function leaveRoom(){
  socket.emit("leave room",{room:config.room });
  config.room = false;
}

function sendMessage(data){
  if(config.room){
    data.room = config.room;
  }
  socket.emit("message",data);
  data.date = new Date().toISOString();
  addMessage(data);
  $("#say").val("");
}

function updateRoom(room){
  $("#room").text(room);
  $("#chatroom").empty().append("you joined room: " + room);
}

function addMessage(data){
  data.user = config.me;
  var template = "<li>"+
  "<span class='user'><%= user %></span> says " +
  "<span><%= data %></span> at " +
  "<abbr class='timeago' title='<%= date %>'></abbr> " +
  "</li>";
  var message = _.template(template,data);
  $("#chatroom").append(message);
  $("abbr.timeago").timeago();
}
