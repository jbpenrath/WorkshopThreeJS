var webgl, controls, gui;

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    // Trackball
//    controls = new THREE.TrackballControls(webgl.camera, webgl.renderer.domElement);
//    controls.rotateSpeed = 1.0;
//				controls.zoomSpeed = 1.2;
//				controls.panSpeed = 0.8;
//
//				controls.noZoom = false;
//				controls.noPan = false;
//
//				controls.staticMoving = true;
//				controls.dynamicDampingFactor = 0.3;
//
//				controls.keys = [ 65, 83, 68 ];
//
//				controls.addEventListener( 'change', webgl.render );

	var gui_params = {'zoom': webgl.camera.position.z}
    // STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	$('body').append( stats.domElement );

	var cameraRotationController = {
		x: webgl.camera.rotation.x,
		y: webgl.camera.rotation.y,
		z: webgl.camera.rotation.z
	}

    var effectController  = {
        focus: 		1.0,
        aperture:	0.025,
        maxblur:	1.0,
		offset: 0.95,
		darkness: 1.6
    };

    var matChanger = function( ) {
        webgl.postprocessing.bokeh.uniforms[ "focus" ].value = effectController.focus;
        webgl.postprocessing.bokeh.uniforms[ "aperture" ].value = effectController.aperture;
        webgl.postprocessing.bokeh.uniforms[ "maxblur" ].value = effectController.maxblur;
        webgl.postprocessing.vignettage.uniforms[ "offset" ].value = effectController.offset;
        webgl.postprocessing.vignettage.uniforms[ "darkness" ].value = effectController.darkness;
    };

	var cameraRotationChanger = function() {
		webgl.camera.rotation.x = cameraRotationController.x,
		webgl.camera.rotation.y = cameraRotationController.y,
		webgl.camera.rotation.z = cameraRotationController.z
	}

    var gui = new dat.GUI();
    gui.add( effectController, "focus", 0.0, 3.0, 0.025 ).onChange( matChanger );
    gui.add( effectController, "aperture", 0.001, 0.2, 0.001 ).onChange( matChanger );
    gui.add( effectController, "maxblur", 0.0, 3.0, 0.025 ).onChange( matChanger );
    gui.add( effectController, "offset", 0.0, 3.0, 0.025 ).onChange( matChanger );
    gui.add( effectController, "darkness", 0.0, 3.0, 0.025 ).onChange( matChanger );
//	gui.add( cameraRotationController, "x").onChange( cameraRotationChanger );
//	gui.add( cameraRotationController, "y", 0.05).onChange( cameraRotationChanger );
//	gui.add( cameraRotationController, "z").onChange( cameraRotationChanger );
    gui.close();

    $(window).on('resize', resizeHandler);
var update = function () {

    stats.begin();

    // monitored code goes here

    stats.end();

    requestAnimationFrame( update );

};

requestAnimationFrame( update );
    animate();
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
//    controls.update();
}
