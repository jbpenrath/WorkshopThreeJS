var Webgl = (function(){

    function Webgl(width, height){

        var self = this;

        // SCENE
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x223399, 0.003);

        // RENDERER
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x051D2A, 0);
        
        // CAMERA
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.y = 50;
        this.camera.rotation.x = Math.PI/12;
        this.camera.position.z = 50;

        // POST PROCESSING
        this.postprocessing = {};
        this.bokeh = {
                focus: 0,
                aperture: 0,
                maxblur: 1.0,

                width: window.innerWidth,
                height: window.innerHeight
            };
		this.vignette = {
			offset: 0.95,
			darkness: 1.6
		}

        this.initPostprocessing();

        // OBJECTS
        this.plane = new Plane(30);
        this.circle = new Circle(20, 13, {x:0, y:0, z:150});

        this.scene.add(this.plane);
        this.scene.add(this.circle);

        // LIGHTS
        this.light = new THREE.PointLight(0x223399, 5);
        this.light.position.set(0, 0, 0);
        this.scene.add(this.light);

        this.frontLight = new THREE.PointLight(0x051D2A, 1, 500);
        this.frontLight.position.set(0, 0, 300);
        this.frontLight.rotation.set(Math.PI/2, 0, 0);
        this.scene.add(this.frontLight);

		this.topLight = new THREE.PointLight(0x112277, 1, 500);
        this.topLight.position.set(0, 300, 0);
        this.scene.add(this.topLight);

        // TRANSITIONS
        // CUBES POSITIONNING
        for ( var i = 0; i < this.plane.cubes.length; i ++ ) {
            TweenMax.to(this.plane.cubes[i].position, 5, {
                x: this.plane.cubesTransformed[i].position.x,
                z: this.plane.cubesTransformed[i].position.z,
                delay: Math.random()*2,
                ease: Linear.easeIn
            })
            TweenMax.to(this.plane.cubes[i].position, 5, {
                y: this.plane.cubesTransformed[i].position.y,
                delay: Math.random()*2+3.5,
                ease: Linear.easeIn
            });
        }

        // CAMERA MOVEMENTS
        TweenMax.to(this.camera.position, 10, {
				y: 0, z: 200,
                ease: Linear.easeOut
            });
		TweenMax.to(this.camera.rotation, 10, {
				x: 0,
                ease: Linear.easeOut
            });


		// BOKEH TIMELINES
		this.bokehTl = new TimelineMax({delay:10, repeat:-1, yoyo:true, onUpdate: function() {
                                    self.postprocessing.composer.passes[2].uniforms['focus'].value = self.bokeh['focus'];
                                    self.postprocessing.composer.passes[2].uniforms['aperture'].value = self.bokeh['aperture'];}});

		this.bokehTl.to(self.bokeh, Math.random()*1.5+3, {
							aperture: Math.random()*0.2 + 0.05, focus: Math.random()*0.5 + 0.1,
                            ease: Linear.easeOut})
				    .to(self.bokeh, Math.random()*1.5+3, {
							aperture: Math.random()*0.007+0.004, focus: Math.random()*3.0+1.0,
							ease: Linear.easeOut});

		this.VignetteTl = new TimelineMax({delay:10, repeat:-1, yoyo:true, onUpdate: function() {
                                    self.postprocessing.composer.passes[1].uniforms['offset'].value = self.vignette['offset'];}});

		this.VignetteTl.to(self.vignette, Math.random()*1.5+3, {
							offset: Math.random()*0.15 + 0.45,
                            ease: Linear.easeOut})
				        .to(self.vignette, Math.random()*1.5+3, {
							offset: Math.random()*0.15+0.75,
							ease: Linear.easeOut});
	};

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        this.postprocessing.composer.render(0.1);
        this.plane.rotation.y += 0.005;
    }

	Webgl.prototype.initPostprocessing = function() {
        console.log('init');
		var renderPass = new THREE.RenderPass(this.scene, this.camera),
			bokehPass = new THREE.BokehPass(this.scene, this.camera, this.bokeh),
        	vignettePass = new THREE.ShaderPass(THREE.VignetteShader);

		bokehPass.renderToScreen = true;

		// Vignetting
        vignettePass.uniforms['offset'].value = this.vignette.offset;
        vignettePass.uniforms['darkness'].value = this.vignette.darkness;


        var renderPass = new THREE.RenderPass(this.scene, this.camera);

		var composer = new THREE.EffectComposer(this.renderer);

		composer.addPass(renderPass);
		composer.addPass(vignettePass);
		composer.addPass(bokehPass);

		this.postprocessing.composer = composer;
		this.postprocessing.vignettage = vignettePass;
		this.postprocessing.bokeh = bokehPass;
	}

    return Webgl;

})();
