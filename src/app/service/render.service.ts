import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Injectable({
  providedIn: 'root'
})

/**
 * @class RenderService
 */
export class RenderService {

  public static readonly WIDTH_SCALE_NAV_OPENED = 350;
  public static readonly WIDTH_SCALE_NAV_COLLAPSED = 64;

  private static heightScale: number = 0.87;
  private static widthScale: number = RenderService.WIDTH_SCALE_NAV_OPENED;

  private static scene: THREE.Scene;
  private static renderer: THREE.WebGLRenderer;

  private static camera: THREE.PerspectiveCamera;
  private static controls: OrbitControls;
  private static axes: THREE.AxesHelper;

  private static grid: THREE.GridHelper;
  private static light: THREE.AmbientLight;
  private static canvas: HTMLCanvasElement;

  private static initEvents: boolean = false;

  /**
   *
   */
  public static init(): void{
    RenderService.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    RenderService.renderer = new THREE.WebGLRenderer({canvas: RenderService.canvas, alpha: true, antialias: true});

    RenderService.renderer.setSize(window.innerWidth - RenderService.widthScale, window.innerHeight * RenderService.heightScale);
    RenderService.renderer.setClearColor(new THREE.Color(0x0), 0);
    RenderService.renderer.setPixelRatio(window.devicePixelRatio);

    RenderService.initScene();
  }

  /**
   *
   * @private
   */
  private static initScene(): void{
    RenderService.scene = RenderService.scene || new THREE.Scene();

    // camera
    if (!RenderService.camera){
      const width = window.innerWidth - RenderService.widthScale;
      const height = window.innerHeight * RenderService.heightScale;
      const aspectRatio = width / height;
      RenderService.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
      RenderService.camera.position.set(100,100,100);
      RenderService.camera.lookAt(new THREE.Vector3(0, 45, 0));
      RenderService.scene.add(RenderService.camera);
    }

    // controls
    RenderService.controls = new OrbitControls(RenderService.camera, RenderService.renderer.domElement);
    RenderService.controls.enableDamping = true;
    RenderService.controls.dampingFactor = 0.1;
    RenderService.controls.minDistance = 20;
    RenderService.controls.maxDistance = 500;
    RenderService.controls.enableRotate = true;
    RenderService.controls.rotateSpeed = 0.1;
    RenderService.controls.enableZoom = true;
    RenderService.controls.zoomSpeed = 1.0;
    RenderService.controls.panSpeed = 0.1;
    RenderService.controls.enablePan = true;
    RenderService.controls.target = new THREE.Vector3(0, 45, 0);

    // light
    if (!RenderService.light){
      RenderService.light = new THREE.AmbientLight(0xF);
      RenderService.light.position.x = 500;
      RenderService.light.position.y = 500;
      RenderService.light.position.z = 500;
      RenderService.scene.add(RenderService.light);
    }

    //grid
    if (!RenderService.grid){
      RenderService.grid = new THREE.GridHelper(250, 50,
        new THREE.Color(0xFFFFFF),
        new THREE.Color(0x888888)
      );
      (RenderService.grid.material as THREE.Material).opacity = 0.25;
      (RenderService.grid.material as THREE.Material).transparent = true;
      (RenderService.grid.material as THREE.Material).fog = false;
      RenderService.scene.add(RenderService.grid);
    }

    //axes
    if (!RenderService.axes){
      RenderService.axes = new THREE.AxesHelper(40);
      (RenderService.axes.material as THREE.Material).fog = false;
      RenderService.scene.add(RenderService.axes);
    }

    RenderService.animate();
    RenderService.resize();
  }

  /**
   *
   * @private
   */
  private static animate(): void {
    if (!RenderService.initEvents){
      window.addEventListener('DOMContentLoaded', () => {
        RenderService.render();
      });

      window.addEventListener('resize', () => {
        RenderService.resize();
      });
      RenderService.initEvents = true;
    }
  }

  /**
   *
   * @private
   */
  private static render(): void {
    requestAnimationFrame(() => {
      RenderService.render();
    });

    RenderService.controls.update();
    RenderService.renderer.render(RenderService.scene, RenderService.camera);
  }

  /**
   *
   * @param widthScale
   */
  public static setWidthScale(widthScale: number): void{
    RenderService.widthScale = widthScale;
  }

  /**
   *
   */
  public static resize(): void {
    const width = window.innerWidth - RenderService.widthScale;
    const height = window.innerHeight * RenderService.heightScale;

    RenderService.camera.aspect = width / height;
    RenderService.camera.updateProjectionMatrix();

    RenderService.renderer.setSize(width, height);
  }

  /**
   *
   */
  public static getScene(): THREE.Scene {
    return RenderService.scene;
  }

}
