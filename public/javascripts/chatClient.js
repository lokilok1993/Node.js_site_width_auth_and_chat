var socket
var name = document.getElementById('userNameLabel').innerText

    window.onunload = function(){
      socket.disconnect();
    }

    window.onload = function(){
      socket = io.connect('http://localhost:8080');

      var field = document.getElementById('field');
      var form = document.getElementById('form');
      var content = document.getElementById('content');
      
      if(name)
        socket.emit('hello', {name: name});

      form.onsubmit = function(){
        var text = field.value;
        socket.emit('send', {message: text});
        return false;
      };

      var messages = [];
      socket.on('message', function(data){
        
        if(data.message){
          messages.push(data.message);
          var html = '';
          for(var i = 0; i<messages.length; i++){
            html += messages[i] + " <br/>";
          }
          content.innerHTML = html;
        }else{
          console.log('Чтото пошло не так');
        }

      });
    };