var dialog = $('#ngdialog1');
var emailInput = $('#emailInput');
var emailSvg = $('#emailSvg');
var subscribeBtn = $('.dialog__sign-up-for-beta__input-button');
var successMsg = $('.dialog__sign-up-for-beta--success');
var dialogInit = $('.dialog__sign-up-for-beta--init');

function showSignUp() {
  dialog.slideDown();
}

function hideSignUp() {
  dialog.slideUp();
}

function enableSubscribeBtn(enable) {
  if (enable) {
    subscribeBtn.removeAttr('disabled');
  } else {
    subscribeBtn.attr('disabled', 'disabled');
  }
}

emailInput.focus(function () {
  emailSvg.css({fill: '#148ef0'});
});
emailInput.blur(function () {
  emailSvg.css({fill: '#c1c9cf'});
});
emailInput.on('input', function (e) {
  var data = emailInput.val().trim();
  enableSubscribeBtn(data !== '');
});

subscribeBtn.click(function () {
  enableSubscribeBtn(false);
  $.post('https://httpbin.org/post', {email: emailInput.val()}, function (result) {
    dialogInit.slideUp();
    successMsg.slideDown();
  })
});

$('.ngdialog-close').click(hideSignUp);

