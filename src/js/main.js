var webgl, controls, gui;

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    // Trackball
    controls = new THREE.TrackballControls(webgl.camera);
    controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;

				controls.noZoom = false;
				controls.noPan = false;

				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;

				controls.keys = [ 65, 83, 68 ];

				controls.addEventListener( 'change', webgl.render );

	var gui_params = {'zoom': webgl.camera.position.z}

    gui = new dat.GUI();
//	gui.add(webgl.camera.position.z, 'zoom', 0, 1000);
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
    controls.update();
}
