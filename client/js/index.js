var button = document.getElementById('joinButton')

button.onclick = function() {
  $(button).popover('dispose');
  var name = document.getElementById('uName').value;
  if (/^[a-zA-Z0-9_]{4,15}$/.test(name)) {
    Cookies.set("username", name, {expires: 1});
    window.location.href = "GameUI.html";
  } else {
    $(button).popover('toggle');
  }

};

document.onkeypress = function (event) {
  if (event.keyCode === 13) button.click();
}
