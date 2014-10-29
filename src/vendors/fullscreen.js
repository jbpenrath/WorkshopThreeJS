function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
}

$(document).keydown(function(e) {
	if(e.keyCode==70) {
		launchFullScreen(document.documentElement);
	}
});
