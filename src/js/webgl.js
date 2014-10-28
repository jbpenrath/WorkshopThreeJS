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
        initPostprocessing(this);

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
        this.renderer.render(this.scene, this.camera);
        this.postprocessing.composer.render( 0.1 );
    }

    return Webgl;

})();

function initPostprocessing(_this) {
    var renderPass = new THREE.RenderPass( _this.scene, _this.camera );

    var bokehPass = new THREE.BokehPass( _this.scene, _this.camera, {
        focus: 		1.0,
        aperture:	0.025,
        maxblur:	1.0,

        width: window.innerWidth,
        height: window.innerHeight
    } );

    bokehPass.renderToScreen = true;

    var composer = new THREE.EffectComposer( _this.renderer );

    composer.addPass( renderPass );
    composer.addPass( bokehPass );

    _this.postprocessing.composer = composer;
    _this.postprocessing.bokeh = bokehPass;

}
