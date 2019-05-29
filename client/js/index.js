setOnClick()

function setOnClick() {
  let joinButton = document.getElementById ('joinButton')
  let modalButton = document.getElementById ('modalButton')
  let createButton = document.getElementById ('createRoomButton')

  joinButton.onclick = function() {
    joinRoom (joinButton, "uName")
  }
  modalButton.onclick = function() {
    joinRoom (modalButton, "modalUserAddon")
  }

  createButton.onclick = function() {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("roomModalCenterTitle").innerText = "Room Code: " + xhttp.responseText
            document.getElementById("roomUrl").disabled = true
            document.getElementById("roomUrl").value = window.location + xhttp.responseText
            document.getElementById("modalUser").value = document.getElementById("uName").value
          }
    }
    xhttp.open("POST", "/newRoom", true)
    xhttp.send()
  }
}

function joinRoom (button, nameElement) {
  console.log("yoaisdnf")
  $(button).popover('dispose');
  var name = document.getElementById(nameElement).value;
  if (/^[a-zA-Z0-9_]{4,15}$/.test(name)) {
    Cookies.set("username", name, {expires: 1});
    window.location.href = "GameUI";
  } else {
    $(button).popover('toggle');
  }
}

// var button = document.getElementById('joinButton')
// var createButton = document.getElementById('createRoomButton')

// button.onclick = function() {
//   $(button).popover('dispose');
//   var name = document.getElementById('uName').value;
//   if (/^[a-zA-Z0-9_]{4,15}$/.test(name)) {
//     Cookies.set("username", name, {expires: 1});
//     window.location.href = "GameUI";
//   } else {
//     $(button).popover('toggle');
//   }

// };

// createButton.onclick = function() {
//   var xhttp = new XMLHttpRequest()
//   xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//           document.getElementById("roomModalCenterTitle").innerText = "Room Code: " + xhttp.responseText
//           document.getElementById("roomUrl").disabled = true
//           document.getElementById("roomUrl").value = window.location + xhttp.responseText
//           document.getElementById("modalUser").value = document.getElementById("uName").value
//         }
//   };
//   xhttp.open("POST", "/newRoom", true)
//   xhttp.send()
// };

// document.onkeypress = function (event) {
//   if (event.keyCode === 13) button.click();
// }
