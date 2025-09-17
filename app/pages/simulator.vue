<template>
    <div class="flex grow h-screen overflow-hidden">
        <canvas id="canvas" class="flex min-w-0 min-h-0 w-full h-full max-w-full" />
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';

const server = new TNYServer(5621);
server.handle('getMotorRotation', async (data) => {
    console.log('getMotorRotation', data);
    return 90; // Example fixed rotation value
});
server.handle('rotateMotorBy', async (data) => {
    console.log('rotateMotorBy', data);
    return true; // Acknowledge the command
});
server.handle('setMotorRotation', async (data) => {
    console.log('setMotorRotation', data);
    return true; // Acknowledge the command
});

server.on('disconnected', () => {
    console.log('Disconnected from server');
    close();
});

onMounted(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const parent = canvas.parentElement as HTMLElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

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

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = function () {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();
});
</script>

<style></style>