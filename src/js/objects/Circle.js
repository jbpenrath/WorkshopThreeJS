var Circle = (function(){

    function Circle(angle, radius, position){
        THREE.Line.call(this);

        var position = position || {x:0, y:0, z:0};

        this.geometry = new THREE.Geometry(),
        this.material = new THREE.LineBasicMaterial({color: 0xffffff});

        for(var i=0; i<=angle; i++) {
            var vector = new THREE.Vector3(Math.cos(i*2*Math.PI/angle)*radius, Math.sin(i*2*Math.PI/angle)*radius, 0);
            this.geometry.vertices.push(vector);
        }

		this.position.set(position.x, position.y, position.z);

    }

    Circle.prototype = new THREE.Line;
    Circle.prototype.constructor = Circle;

    return Circle;

})();
