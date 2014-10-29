var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);

        this.camera.position.x= 125;
        this.camera.position.y = 50;
        this.camera.position.z = 325;
//        this.camera.rotation.y = Math.PI / 14;
//        this.camera.rotation.z = Math.PI / 2;


        this.scene.fog = new THREE.FogExp2(0x06111A, 0.002);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x06111A);

        for(var i=0; i<25; i++) {
            for(var j=0; j<25; j++) {
                var cube = new Cube();
                cube.position.x =i*20;
                cube.position.z = j*20;
                cube.position.y = Math.random() * 20;
                this.scene.add(cube);
            }
        }

        this.postprocessing = {};
        this.initPostprocessing();

        this.light = new THREE.PointLight(0x5d0080);
        this.light.position.set(125, 500, 125);
        this.scene.add(this.light);

        var DirectionalLightHelper = new THREE.PointLightHelper(this.light, 10);
        this.scene.add(DirectionalLightHelper);

        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(this.ambientLight);

    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        //this.renderer.render(this.scene, this.camera);
        this.postprocessing.composer.render( 0.1 );
    }

	Webgl.prototype.initPostprocessing = function() {
		var renderPass = new THREE.RenderPass(this.scene, this.camera),
			bokehPass = new THREE.BokehPass(this.scene, this.camera, {});

		bokehPass.renderToScreen = true;

		var composer = new THREE.EffectComposer(this.renderer);

		composer.addPass(renderPass);
		composer.addPass(bokehPass);

		this.postprocessing.composer = composer;
		this.postprocessing.bokeh = bokehPass;
	}

    return Webgl;

})();
