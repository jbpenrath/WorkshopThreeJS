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



        this.scene.fog = new THREE.FogExp2(0x223399, 0.003);

        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x06111A, 0);



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
            TweenMax.to(cubes[i].position, 2.5, {
                x: cubesTransformed[i].position.x,
                z: cubesTransformed[i].position.z,
                delay: Math.random()*2,
                ease: Linear.easeIn
            })
            TweenMax.to(cubes[i].position, 2.5, {
                y: cubesTransformed[i].position.y,
                delay: Math.random()*2+1.5,
                ease: Linear.easeIn
            });
        }

        TweenMax.to(this.camera.position, 5, {
                y: 0,
                z: 200,
                ease: Linear.easeOut
                //delay: Math.random()*10
            });

        TweenMax.to(this.camera.rotation, 5, {
                x: 0,
                ease: Linear.easeOut
                //delay: Math.random()*10
            });



        this.postprocessing = {};
        this.bokeh = {
                focus: 		0,
                aperture:	0,
                maxblur:	0,

                width: window.innerWidth,
                height: window.innerHeight
            };
        this.initPostprocessing(this);
        var self = this;
//        var apertureAnimation = TweenMax.to(self.bokeh, Math.random()*1.5+1, {
//                                aperture: 0.1,
//                                delay: 10,
//                                ease: Linear.easeInOut,
//                                onUpdate: function() {
//                                    console.log(self.bokeh.aperture);
//                                    self.postprocessing.composer.passes[1].uniforms.aperture.value = self.bokeh.aperture;
//                                },
//                                onComplete: function() {
//                                    TweenMax.to(self.bokeh, Math.random()*1.5+1, {
//                                        aperture: 0.025,
//                                        ease: Linear.easeInOut,
//                                        onUpdate: function() {
//                                            console.log(self.bokeh.aperture);
//                                            self.postprocessing.composer.passes[1].uniforms.aperture.value = self.bokeh.aperture;
//                                        },
//                                        onComplete: function() {
//                                            apertureAnimation.play();
//                                        }});
//                                }});

        TweenMax.to(this.bokeh, 2.5, {
                        focus: 2.0,
                        aperture:	0.025,
                        maxblur:	1.0,
                        ease: Linear.easeOut,
                        delay: 5,
                        onUpdate: function() {
                            self.postprocessing.composer.passes[1].uniforms.focus.value = self.bokeh.focus;
                            self.postprocessing.composer.passes[1].uniforms.aperture.value = self.bokeh.aperture;
                            self.postprocessing.composer.passes[1].uniforms.maxblur.value = self.bokeh.maxblur;
                        },
                        onComplete: function() {
                            TweenLite.to(document.getElementById('title').style, 5, {
                                opacity: 1
                            });
                        }
                    });





        this.light = new THREE.PointLight(0x223399, 5);
        this.light.position.set(0, 0, 0);
        this.scene.add(this.light);

        this.Underlight = new THREE.PointLight(0xffffff, 1, 500);
        this.Underlight.position.set(0, 0, 300);
        this.Underlight.rotation.set(Math.PI/2, 0, 0);
        this.scene.add(this.Underlight);

        // Text test


        var DirectionalLightHelper = new THREE.PointLightHelper(this.Underlight, 10);
        this.scene.add(DirectionalLightHelper);

    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
//        this.renderer.render(this.scene, this.camera);
        this.postprocessing.composer.render( 0.1 );
        this.Cubecontainer.rotation.y += 0.01;

    }

	Webgl.prototype.initPostprocessing = function(self) {
        console.log('init');
		var renderPass = new THREE.RenderPass(self.scene, self.camera),
			bokehPass = new THREE.BokehPass(self.scene, self.camera, self.bokeh);

		bokehPass.renderToScreen = true;

		var composer = new THREE.EffectComposer(self.renderer);

		composer.addPass(renderPass);
		composer.addPass(bokehPass);

		self.postprocessing.composer = composer;
		self.postprocessing.bokeh = bokehPass;
	}

    return Webgl;

})();
