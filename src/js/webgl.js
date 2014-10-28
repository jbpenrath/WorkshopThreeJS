var postprocessing = {};
	var bokeh_params = {
			shaderFocus	: false,
			fstop 		: 2.6 * 3,
			maxblur 	: 2.0,
			showFocus 	: false,
			focalDepth 	: 4.2,
			manualdof 	: false,
			vignetting 	: true,
			depthblur 	: false,

			threshold 	: 0.5,
			gain 		: 0.1,
			bias 		: 0.5,
			fringe		: 0.7,

			focalLength	: 35,
			noise		: false,
			pentagon	: false,

			dithering	: 0.00001
		};

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

        this.light = new THREE.PointLight(0x5d0080);
        this.light.position.set(125, 500, 125);
        this.scene.add(this.light);

        var DirectionalLightHelper = new THREE.PointLightHelper(this.light, 10);
        this.scene.add(DirectionalLightHelper);

        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(this.ambientLight);

        initPostProcessing(this);

        /* Setting up the DoF parameters to bokeh shader */
		for( var e in bokeh_params ) {
			if( e in postprocessing.bokeh_uniforms )
				postprocessing.bokeh_uniforms[e].value = bokeh_params[e];
		}
		postprocessing.enabled = true;
		postprocessing.bokeh_uniforms["znear"].value 	= this.camera.near;
		postprocessing.bokeh_uniforms["zfar"].value 	= this.camera.far;
		this.camera.setLens( bokeh_params.focalLength );



    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.renderer.render(this.scene, this.camera);
        this.renderer.render( postprocessing.scene, postprocessing.camera );
    }

    /**
	* Init the depth of field post processing scene
	*/
	function initPostProcessing(_this) {
		postprocessing.scene  = _this.scene;
		postprocessing.camera = _this.camera;

		/* Rendering to color and depth textures */
		var params = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format   : THREE.RGBFormat
		};

		/* Preparing the frame buffers to be rendered to */
		postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, params );
		postprocessing.rtTextureColor = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, params );

		var bokeh_shader = THREE.BokehShader;
		postprocessing.bokeh_uniforms = THREE.UniformsUtils.clone( bokeh_shader.uniforms );
		postprocessing.bokeh_uniforms["tColor"].value = postprocessing.rtTextureColor;
		postprocessing.bokeh_uniforms["tDepth"].value = postprocessing.rtTextureDepth;

		postprocessing.bokeh_uniforms["textureWidth" ].value = window.innerWidth;
		postprocessing.bokeh_uniforms["textureHeight"].value = window.innerHeight;

		postprocessing.materialBokeh = new THREE.ShaderMaterial( {
			uniforms 		: postprocessing.bokeh_uniforms,
			vertexShader 	: bokeh_shader.vertexShader,
			fragmentShader 	: bokeh_shader.fragmentShader,
			defines: {
				RINGS	: 3,
				SAMPLES	: 2
			}
		} );

		postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ), postprocessing.materialBokeh );
		_this.scene.add( postprocessing.quad );
	}

    return Webgl;

})();
