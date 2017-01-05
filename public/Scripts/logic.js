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
  var lastTyped; // in milliseconds from 1/1/1970 20000 = to 20 secs
  var typing = false;


  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message',$message.val());
    $message.val('');
  });

  socket.on('new message',function(data){
    $chat.append('<p><strong>'+data.user+':</strong> '+data.msg+'</p>');
    updateScroll();
  });
  socket.on('user connect',function(data){
    $chat.append('<p><strong>'+data.user+' </strong> has joined the chat. </p>');
    updateScroll();
    onlineUsersCount++;
    $('#onlineUsers').text('Online Users ('+onlineUsersCount+')');
  });
  socket.on('user disconnect',function(data){
    $chat.append('<p><strong>'+data.user+' </strong> has left the chat. </p>');
    updateScroll();
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

  $userForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user',$username.val(), function(data){
      if(data){
        $userFormArea.hide();
        $messageArea.show();
        $('body').css('background-image', 'url(' + '/images/blurred-min.jpg' + ')');
      }
    });
    $username.val('');
  });

  socket.on('get users', function(data){
    var html = '';
    for(i = 0;i<data.length;i++){
      html += '<li class="list-group-item">'+data[i]+'</li>'
    }
    $users.html(html);
  });

  $message.on('keypress', function (e){
    console.log('user is typing');

    if (e.keyCode == 13){ //add remove key
      submitMessage();
      checkIfHasStoppedTyping(false);
    }else{
      isTyping();
    }
  });

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
    var timeout=setTimeout(checkIfHasStoppedTyping,3000);

  }
  function checkIfHasStoppedTyping(typing){
    var currentTime = new Date().getTime();
    if (currentTime - lastTyped>3000 && !typing){ //checks if the lasttyped time was more than 10 secs ago
      socket.emit('user has stopped typing');
          typing = false;
    }
  }
});
