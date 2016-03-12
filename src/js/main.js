var webgl,
    controls,
    gui,
    opacity = 1,
    transform = {
      circle: {
        position: {x: 0, y:0, z:150},
        rotation: {x: 0, y:0, z:0}
      },
      plane: {
        position: {x:0, y:0, z:0},
        rotation: {x:0, y:0, z:0}
      },
      title: {opacity: 1}
    };

$(document).ready(init);

function init () {
  webgl = new Webgl(window.innerWidth, window.innerHeight);
  $('.three').append(webgl.renderer.domElement);

  $(window).on('resize', resizeHandler);

  $('body').on('mousemove', function(e) {
  	var cursorPos = e.pageX,
  		  currentCubePos = self.webgl.plane.position,
  		  currentLinePos = self.webgl.circle.position;

    self.transform.plane.position.x = (e.pageX - window.innerWidth/2)/150;
    self.transform.plane.position.y = -((e.pageY - window.innerHeight/2)/150);
    self.transform.plane.position.z = currentCubePos.z;
    self.transform.plane.rotation.x = -((e.pageY - window.innerHeight/2)/150)*Math.PI/150;
    self.transform.plane.rotation.y = ((e.pageX - window.innerWidth/2)/150)*Math.PI/150;

  	self.transform.circle.position.x = (e.pageX - window.innerWidth/2)/90;
  	self.transform.circle.position.y = -((e.pageY - window.innerHeight/2)/90);
  	self.transform.circle.position.z = currentLinePos.z;
    self.transform.circle.rotation.x = ((e.pageY - window.innerHeight/2)/70)*Math.PI/70;
    self.transform.circle.rotation.y = ((e.pageX - window.innerWidth/2)/90)*Math.PI/90;

    self.transform.title.opacity = (Math.abs((window.innerWidth/24)/(e.pageX - window.innerWidth/2)));
  });

  var update = function () {
    requestAnimationFrame( update );
  };

  requestAnimationFrame( update );
  animate();
}

function resizeHandler () {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate () {
  requestAnimationFrame(animate);

  webgl.plane.position.x += (transform.plane.position.x - webgl.plane.position.x) * 0.1;
  webgl.plane.position.y += (transform.plane.position.y - webgl.plane.position.y) * 0.1;
  webgl.plane.position.z += (transform.plane.position.z - webgl.plane.position.z) * 0.1;

  self.webgl.plane.children.forEach(function (cube) {
    cube.rotation.x += (transform.plane.rotation.x - cube.rotation.x) * 0.1;
    cube.rotation.y += (transform.plane.rotation.y - cube.rotation.y) * 0.1;
    cube.rotation.z += (transform.plane.rotation.z - cube.rotation.z) * 0.1;
  });

  webgl.circle.position.x += (transform.circle.position.x - webgl.circle.position.x) * 0.1;
  webgl.circle.position.y += (transform.circle.position.y - webgl.circle.position.y) * 0.1;
  webgl.circle.position.z += (transform.circle.position.z - webgl.circle.position.z) * 0.1;
  webgl.circle.rotation.x += (transform.circle.rotation.x - webgl.circle.rotation.x) * 0.1;
  webgl.circle.rotation.y += (transform.circle.rotation.y - webgl.circle.rotation.y) * 0.1;

  opacity -= (opacity - transform.title.opacity) * 0.05;

  $('#title').css('opacity', opacity);

  webgl.render();
}
