var Sphere = (function(){

    function Sphere(radius, hmaille, vmaille, wireframe, pop){
        THREE.Object3D.call(this);

        this.wireframe = wireframe !== undefined ? wireframe :  true;

        var geometry = new THREE.SphereGeometry(radius, hmaille, vmaille);
//        var material = new THREE.MeshLambertMaterial({color: 0x333333, wireframe: this.wireframe});
        var materials = [
            new THREE.MeshLambertMaterial( { color: 0x06111A, shading: THREE.SmoothShading } ),
            new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 0.1 } )
        ];
        this.mesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);

        if(pop) {
            for(var i=0; i< 200; i++) {
                var geometry = new THREE.BoxGeometry( 10, 10, 10 );
                var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                var cube = new THREE.Mesh( geometry, material );
                cube.position.x = Math.random() * 2 - 1;
                cube.position.y = Math.random() * 2 - 1;
                cube.position.z = Math.random() * 2 - 1;
                cube.position.normalize();
                cube.position.multiplyScalar( 250 );
                this.add(cube);
            }
        }
        this.add(this.mesh);
    }

    Sphere.prototype = new THREE.Object3D;
    Sphere.prototype.constructor = Sphere;

    Sphere.prototype.update = function(value) {
        this.rotation.y += value;
    };

    return Sphere;
})();
