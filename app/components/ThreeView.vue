<template>
    <canvas id="canvas" class="flex min-w-0 min-h-0 w-full h-full max-w-full" />
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

onMounted(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    setTimeout(() => {
        if (parent && canvas) {
            canvas.style.width = parent.getBoundingClientRect().width+'px';
            canvas.style.height = parent.getBoundingClientRect().height+'px';
            renderer.setSize(parent.getBoundingClientRect().width, parent.getBoundingClientRect().height);
            camera.aspect = parent.getBoundingClientRect().width / parent.getBoundingClientRect().height;
            camera.updateProjectionMatrix();
        }
    }, 100);

    window.addEventListener('resize', () => {
        setTimeout(() => {
            if (parent && canvas) {
                canvas.style.width = parent.getBoundingClientRect().width+'px';
                canvas.style.height = parent.getBoundingClientRect().height+'px';
                renderer.setSize(parent.getBoundingClientRect().width, parent.getBoundingClientRect().height);
                camera.aspect = parent.getBoundingClientRect().width / parent.getBoundingClientRect().height;
                camera.updateProjectionMatrix();
            }
        }, 100);
    });

    // Add a grid helper instead of a cube
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.rotation.x = Math.PI / 2; // Rotate to lie flat on the X-Y plane
    scene.add(gridHelper);

    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
});
</script>

<style></style>