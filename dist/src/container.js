import { scale_meter_px } from "./configurations";
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { scene } from "./configurations.js";
import { truck_wheels, truck_support } from "../main.js";

class Container {

    static instances;

    constructor(width, height, lenght, capacity) {
        this.w = parseInt(width * scale_meter_px);
        this.h = parseInt(height * scale_meter_px);
        this.l = parseInt(lenght * scale_meter_px);
        this.capacity = parseInt(capacity);

        this.loadContainer();

        //push the created container into the instances
        Container.instances = this.getContainer;
    }

    //the container data that will be used in the whole application
    get getContainer() {
        return {
            w: this.w,
            h: this.h,
            l: this.l,
            capacity: this.capacity,
        }
    }

    //the container data that will be stored in the localstorage
    get getContainerLocalStorage() {
        return {
            w: this.w / scale_meter_px,
            h: this.h / scale_meter_px,
            l: this.l / scale_meter_px,
            capacity: this.capacity,
        }
    }

    loadContainer() {
        var material = new THREE.MeshLambertMaterial(
            {
                color: 0x949494,
                side: THREE.DoubleSide,
            });

        var transparentMaterial = new THREE.MeshLambertMaterial(
            {
                color: 0x949494,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });

        var plane;
        var container = new THREE.Group();
        container.name = "Full_Container";

        const boxGeometryX = new THREE.BoxGeometry(this.w + 5, 5, this.l + 5)
        const boxGeometryY = new THREE.BoxGeometry(this.w + 5, this.h, 5)
        const boxGeometryZ = new THREE.BoxGeometry(5, this.h, this.l)

        boxGeometryX.translate(this.w / 2 - 5 / 2, - 5 / 2 - 0.1, this.l / 2 - 5 / 2);
        boxGeometryY.translate(this.w / 2 - 5 / 2, this.h / 2, -5 / 2 - 0.1);
        boxGeometryZ.translate(-5 / 2 - 0.1, this.h / 2, this.l / 2);

        plane = new THREE.Mesh(boxGeometryX, material)
        container.add(plane)
        plane.castShadow = true;
        plane.receiveShadow = true;

        plane = new THREE.Mesh(boxGeometryY, transparentMaterial)
        container.add(plane)

        plane = new THREE.Mesh(boxGeometryZ, transparentMaterial)
        container.add(plane)

        //load the parts of the truck
        this.loadTruck(this.w, this.l, container)

        //update the container size to the localstorage
        localStorage.setItem("container", JSON.stringify(this.getContainerLocalStorage));
    }

    loadTruck(width, lenght, container) {

        truck_wheels.position.set(width - 440, -110, lenght / 2);
        truck_support.position.set(400, -110, lenght / 2);

        container.add(truck_wheels);
        container.add(truck_support);

        scene.add(container);
    }
}

export default Container;