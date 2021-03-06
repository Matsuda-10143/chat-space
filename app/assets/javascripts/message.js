$(document).on('turbolinks:load', function(){

  function buildMessage(message) {
    var content = message.content ? `${ message.content }` : "";
    var img = message.image ? `<img src= ${ message.image }>` : "";
    var html = `<div class="message-box" data-message-id= ${message.id} style="heght: 25px;">
                  <div class="comment-user_detail" style="display: flex;">
                    <div class="user-name_box">${message.user_name}</div>
                    <div class="time-log" style="padding-left: 10px;">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="message">
                    <p class="content">${content}</p>
                    <div>${img}</div>
                  </div>
                </div>`
    return html;
  }

  function scroll(){
    $('.message-room').animate({scrollTop: $('.message-room')[0].scrollHeight}, 'swing');
  }

  $('#new_message').on('submit',function(e){
    e.preventDefault();
    var formdata = new FormData(this);
    var url = $(this).attr('action');
    
    $.ajax({
      url: url,
      type: "POST",
      data: formdata,
      dataType: 'json',
      processData: false,
      contentType: false
    })

    .done(function(message){
      var html = buildMessage(message);
      $('.message-room').append(html);
      $('.new_message')[0].reset();
      scroll();
    })
    .fail(function(){
      alert('メッセージを入力してください');
    })
    .always(function(){
      $('.send-btn_box').prop('disabled', false);
    })
  });

  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      last_message_id = $('.message-box:last').data("message-id");

      $.ajax({
        url: "api/messages",
        type: 'get',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
        var insert ='';
        messages.forEach(function(message) {
          insert = buildMessage(message);
          $('.message-room').append(insert);
          scroll();
        })
      })
      .fail(function () {
        alert('自動更新に失敗しました');
      });
    }
  };
  setInterval(reloadMessages, 5000);
});