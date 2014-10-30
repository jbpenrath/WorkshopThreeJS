var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
//
//        this.camera.position.x= 125;
        this.camera.position.y = 50;
        this.camera.rotation.x = Math.PI/12;
        this.camera.position.z = 50;

		var geometry = drawGeometryCircle(20, 13);
		 var material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });


		this.line = new THREE.Line(geometry, material);
		this.line.position.set(0,0,150);
		this.scene.add(this.line);

        this.scene.fog = new THREE.FogExp2(0x223399, 0.003);

        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x051D2A, 0);

		this.postprocessing = {};
        this.bokeh = {
                focus: 		0,
                aperture:	0,
                maxblur:	1.0,

                width: window.innerWidth,
                height: window.innerHeight
            };

		this.vignette = {
			offset: 0.95,
			darkness: 1.6
		}

        this.initPostprocessing();

        this.Cubecontainer = new THREE.Object3D;
        var cubes = [],
            cubesTransformed = [];

        this.scene.add(this.Cubecontainer);

        for(var i=0; i<30; i++) {
            for(var j=0; j<30; j++) {
                var cube = new Cube();
                cube.position.x = Math.random()*2-1;
                cube.position.y = Math.random()*2-1,
                cube.position.z = Math.random()*2-1;

                cube.position.normalize();
                cube.position.multiplyScalar( Math.random() * 10 + 25 );
                cube.scale.multiplyScalar( 2 );

                cubesTransformed.push(cube);

                cube = new Cube();
                cube.position.x = i-20;
                cube.position.z = j-20;
                cubes.push(cube);
                this.Cubecontainer.add( cube );
            }
        }

        for ( var i = 0; i < cubes.length; i ++ ) {
            TweenMax.to(cubes[i].position, 5, {
                x: cubesTransformed[i].position.x,
                z: cubesTransformed[i].position.z,
                delay: Math.random()*2,
                ease: Linear.easeIn
            })
            TweenMax.to(cubes[i].position, 5, {
                y: cubesTransformed[i].position.y,
                delay: Math.random()*2+3.5,
                ease: Linear.easeIn
            });
        }

		var self = this;

		this.bokehTl = new TimelineMax({delay:10,
								   repeat:-1,
								   yoyo:true,
								   onUpdate: function() {
                                    self.postprocessing.composer.passes[2].uniforms.focus.value = self.bokeh.focus;
                                    self.postprocessing.composer.passes[2].uniforms.aperture.value = self.bokeh.aperture;
                                }});

		this.bokehTl.to(self.bokeh, Math.random()*1.5+3, {
							aperture: Math.random()*0.2 + 0.05,
                            focus: Math.random()*0.5 + 0.1,
                            ease: Linear.easeOut})
				.to(self.bokeh, Math.random()*1.5+3, {
							aperture: Math.random()*0.007+0.004,
							focus: Math.random()*3.0+1.0,
							ease: Linear.easeOut});

		this.VignetteTl = new TimelineMax({delay:10,
								   repeat:-1,
								   yoyo:true,
								   onUpdate: function() {
                                    self.postprocessing.composer.passes[1].uniforms.offset.value = self.vignette.offset;
                                }});

		this.VignetteTl.to(self.vignette, Math.random()*1.5+3, {
							offset: Math.random()*0.15 + 0.45,
                            ease: Linear.easeOut})
				.to(self.vignette, Math.random()*1.5+3, {
							offset: Math.random()*0.15+0.75,
							ease: Linear.easeOut});

        TweenMax.to(this.camera.position, 10, {
				y: 0,
                z: 200,
                ease: Linear.easeOut
            });
		TweenMax.to(this.camera.rotation, 10, {
				x: 0,
                ease: Linear.easeOut
            });





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

        // Text test


//        var DirectionalLightHelper = new THREE.PointLightHelper(this.Underlight, 10);
//        this.scene.add(DirectionalLightHelper);


	};

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
		if(this.postprocessing) {
			this.postprocessing.composer.render(0.1);
		} else {
			this.renderer.render(this.scene, this.camera);
		}
        this.Cubecontainer.rotation.y += 0.005;

    }

	Webgl.prototype.initPostprocessing = function() {
        console.log('init');
		var renderPass = new THREE.RenderPass(this.scene, this.camera),
			bokehPass = new THREE.BokehPass(this.scene, this.camera, this.bokeh),
        	vignettePass = new THREE.ShaderPass(THREE.VignetteShader);

		bokehPass.renderToScreen = true;
		//vignettePass.renderToScreen = true;

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

	$('.three').on('mousemove', function(e) {
		var cursorPos = e.pageX,
			currentCubePos = self.webgl.Cubecontainer.position,
			currentLinePos = self.webgl.line.position;

		self.webgl.Cubecontainer.position.set((e.pageX - window.innerWidth/2)/150, -((e.pageY - window.innerHeight/2)/150), currentCubePos.z);
		self.webgl.Cubecontainer.children.forEach(function(cube){
			cube.rotation.set(-((e.pageY - window.innerHeight/2)/150)*Math.PI/150, ((e.pageX - window.innerWidth/2)/150)*Math.PI/150, 0);
		});

		self.webgl.line.position.set((e.pageX - window.innerWidth/2)/90, -((e.pageY - window.innerHeight/2)/90), currentLinePos.z);
		self.webgl.line.rotation.set(((e.pageY - window.innerHeight/2)/70)*Math.PI/70, ((e.pageX - window.innerWidth/2)/90)*Math.PI/90, 0);

		$('#title').css('opacity', Math.abs((window.innerWidth/24)/(e.pageX - window.innerWidth/2)));

	});


    return Webgl;

})();

function drawGeometryCircle(side, radius) {
	var circleGeometry = new THREE.Geometry();

	for(var i=0; i<=side; i++) {
		var vector = new THREE.Vector3(Math.cos(i*2*Math.PI/side)*radius, Math.sin(i*2*Math.PI/side)*radius, 0);
		circleGeometry.vertices.push(vector);
	}

//	circleGeometry.vertices.push(new THREE.Vector3(-10, 0, 0));
//    	circleGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
//    	circleGeometry.vertices.push(new THREE.Vector3(10, 0, 0));


	return circleGeometry;

}
