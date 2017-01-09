$(function(){
  var socket = io.connect();
  var $messageForm = $('#messageForm');
  var $message = $('#message');
  var $chat = $('#chat');
  var $messageArea = $('#messageArea');
  var $userFormArea = $('#userFormArea');
  var $userForm = $('#userForm');
  var $users = $('#users');
  var $username = $('#username');
  var $onlineUsers =$('#onlineUsers');
  var $status = $('#status');
  var onlineUsersCount=0;
  var lastTyped; // in milliseconds from 1/1/1970 1000ms = 1 sec
  var typing = false;

//socket events
  socket.on('new message',function(data){
    $chat.append('<p><strong>'+data.user+':</strong> '+data.msg+'</p>');
    updateScroll();
  });
  socket.on('user connect',function(data){
    $chat.append('<p><strong>'+data.user+' </strong> has joined the chat. </p>');
    updateScroll();
    onlineUsersCount++;
    $('#onlineUsers').text('Online Users ('+onlineUsersCount+')');
    $chat.append('<p><strong>ChatBot:</strong> Welcome '+data.user+'</p>');
    //add a list of welcome message to chose from
  });
  socket.on('user disconnect',function(data){
    $chat.append('<p><strong>'+data.user+' </strong> has left the chat. </p>');
    updateScroll();
    if (onlineUsersCount>1)
        onlineUsersCount--;
    $('#onlineUsers').text('Online Users ('+onlineUsersCount+')');
  });
  socket.on('update status',function(data){
    $status.text('');
    if(data.typing){
      $status.append(data.user+' is typing..');
    }else
      $status.text('');
  })
  socket.on('get users', function(data){
    var html = '';
    for(i = 0;i<data.length;i++){
      html += '<li><a class="connectedUser"> ' + data[i] + '</a></li>'
    }
    $users.html(html);
  });
//user events
  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message',$message.val());
    $message.val('');
  });
  $userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user',$username.val(), function(data){
      if(data){
        $userFormArea.hide();
        $messageArea.show();
        $('body').css('background-image', 'url(' + '/images/white.jpg' + ')');
      }
    });
    $username.val('');
  });
  $message.on('keypress', function (e){
    isTyping();
    checkIfHasStoppedTyping(typing);
  });
  $(document).on('click', '#users li a', function(e){
      e.preventDefault();
      //$chat.append('<p>creating a private chat</p>');
      //$chat.append('<p>https://mckchat.com/room/?'+makeid()+'');
      $chat.append('<p><strong>ChatBot:</strong> This will let you chat privatly with someone, it will be avaible soon.</p>');
  });
//functions
  function submitMessage(){
    socket.emit('send message',$message.val());
    $message.val('');
  }
  function updateScroll(){
    var element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
  }
  function isTyping(){
    typing=true;
    lastTyped = new Date().getTime();
    socket.emit('user is typing');
    var timeout=setTimeout(checkIfHasStoppedTyping,1000);

  }
  function checkIfHasStoppedTyping(typing){
    var currentTime = new Date().getTime();
    if (currentTime - lastTyped>1000 && !typing){ //checks if the lasttyped time was more than 10 secs ago
      socket.emit('user has stopped typing');
          typing = false;
    }
  }
  function makeid(){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
      //add every generated id to a list
      //after generating an id check if its in the list
      //if not send it to the user, if it already exist generate a new id
  }
});
