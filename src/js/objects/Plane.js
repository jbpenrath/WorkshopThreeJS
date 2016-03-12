var Plane = (function () {
    function Plane (resolution) {
      THREE.Object3D.call(this);

      this.cubes = [],
      this.cubesTransformed = [];

      for(var i=0; i<resolution; i++) {
        for(var j=0; j<resolution; j++) {
          var cube = new Cube();

          cube.position.x = Math.random()*2-1;
          cube.position.y = Math.random()*2-1,
          cube.position.z = Math.random()*2-1;
          cube.position.normalize();
          cube.position.multiplyScalar( Math.random() * 10 + 25 );
          cube.scale.multiplyScalar( 2 );

          this.cubesTransformed.push(cube);

          cube = new Cube();
          cube.position.x = i-20;
          cube.position.z = j-20;
          this.cubes.push(cube);
          this.add( cube );
        }
      }
    }

    Plane.prototype = new THREE.Object3D;
    Plane.prototype.constructor = Plane;

    return Plane;
})();
