var Cube = (function () {

    function Cube(){
        THREE.Object3D.call(this);

        var geometry = new THREE.BoxGeometry(20, 20, 20),
//            materials = [
//                            new THREE.MeshLambertMaterial( { color: 0x06111A, shading: THREE.SmoothShading } ),
//                            new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, transparent: true, opacity: 0.05 } )
//                        ];
            material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture("./img/cube.png")});

        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);

    }

    Cube.prototype = new THREE.Object3D;
    Cube.prototype.constructor = Cube;

    return Cube;

})();
