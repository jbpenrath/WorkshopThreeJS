var Cube = (function () {
    function Cube () {
      THREE.Object3D.call(this);

      var geometry = new THREE.BoxGeometry(1, 1, 1),
          material = new THREE.MeshLambertMaterial({ color: 0xffffff });

      this.mesh = new THREE.Mesh(geometry, material);
      this.add(this.mesh);
    }

    Cube.prototype = new THREE.Object3D;
    Cube.prototype.constructor = Cube;

    return Cube;
})();
