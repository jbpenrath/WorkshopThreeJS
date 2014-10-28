var webgl, gui;

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

	var gui_params = {'zoom': webgl.camera.position.z}

    gui = new dat.GUI();
	gui.add(gui_params, 'zoom', 0, 1000).onChange(function(value) {
		webgl.camera.position.z = value;
	});
    gui.close();

    $(window).on('resize', resizeHandler);

    animate();
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
}
