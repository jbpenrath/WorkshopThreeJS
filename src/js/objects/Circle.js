var Circle = (function(){

    function Circle(angle, radius){
        THREE.Object3D.call(this);

        this.wireframe = wireframe !== undefined ? wireframe :  true;

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
    }

    Circle.prototype = new THREE.Object3D;
    Circle.prototype.constructor = Circle;

    return Sphere;
})();
