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


  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message',$message.val());
    $message.val('');
  });

  socket.on('user connect',function(data){
    $chat.append('<p>'+data.user+' has joined the chat. </p>');
    updateScroll();
  });
  
  socket.on('user disconnect',function(data){
    $chat.append('<p>'+data.user+' has left the chat. </p>');
    updateScroll();
  });
  
    socket.on('new message',function(data){
    $chat.append('<p><strong>'+data.user+':</strong> '+data.msg+'</p>');
    updateScroll();
  });

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
    if (e.keyCode == 13){
      submitMessage();
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
});
