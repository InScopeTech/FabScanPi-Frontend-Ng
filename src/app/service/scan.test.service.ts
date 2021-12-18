import { Injectable } from '@angular/core';
import * as THREE from "three";
import { interval, Subscription } from "rxjs";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { PointCloud } from "../model/pointcloud.model";
import { Point } from "../model/point.model";

@Injectable({
  providedIn: 'root'
})

/**
 * @class ScanTestService
 */
export class ScanTestService {
  private subscription: Subscription | undefined;
  private streamingIndex: number = 0;
  private streamingGeometryBufferSize: number = 0;
  private streamingGeometry: THREE.BufferGeometry | undefined;
  private doneUpdateAfterScan: boolean = false;
  private readonly pointCloud: PointCloud;
  private readonly period: number = 1;
  private readonly pointStreamRange: number = 12000;

  /**
   * @constructor
   */
  constructor() {
    this.pointCloud = new PointCloud(15000);
  }

  /**
   *
   */
  public runTest(): void {
    this.loadPlyAsync('./assets/models/einstein_cleaned.ply').then((geometry) => {
      this.streamingGeometry = geometry as THREE.BufferGeometry;
      this.streamingGeometryBufferSize = this.streamingGeometry.attributes['position'].count * 3;

      const source = interval(this.period);
      this.subscription = source.subscribe(this.scanTick.bind(this));
    }, error => {
      console.error(error);
    });
  }

  /**
   *
   * @private
   */
  private scanTick(): void {
    if (!this.streamingGeometry) return;

    if (this.streamingIndex >= this.streamingGeometryBufferSize) {
      if(!this.doneUpdateAfterScan) {
        console.log("== SCAN FINISHED ==");
        console.log("ChunkCount: " + this.pointCloud.getPointCloudChunks().length);

        let pointCount = 0;
        let pointCountSum = 0;
        let bufferAllocCountSum = 0;

        this.pointCloud.getPointCloudChunks().forEach((cloudChunks) => {
          pointCount = cloudChunks.getSize();
          pointCountSum += pointCount;
          bufferAllocCountSum += cloudChunks.getMaxSize();
        });

        console.log("PointCount: " + pointCountSum);
        console.log("PointAllocCount: " + bufferAllocCountSum);
        console.log("OverAllocated: " + (bufferAllocCountSum / pointCountSum - 1.0) * 100 + " %");
        console.log("===================");
        console.log(this.pointCloud);
        this.pointCloud.getCurrentPointCloudChunk().update();
        this.doneUpdateAfterScan = true;
      }

      return;
    }

    let numPoints = Math.floor(Math.random() * this.pointStreamRange);
    let points: Array<Point> = [];

    if ((this.streamingIndex + (numPoints * 3)) >= this.streamingGeometryBufferSize)
      numPoints = (this.streamingGeometryBufferSize - this.streamingIndex) / 3;

    let positions = this.streamingGeometry.attributes['position'];
    let colors = this.streamingGeometry.attributes['color'];

    for (let i = 0; i < numPoints; i++) {
      let position = new THREE.Vector3();
      let color = new THREE.Color();

      position.x = positions.array[this.streamingIndex];
      color.r = colors ? colors.array[this.streamingIndex] : 1.0;
      this.streamingIndex++;

      position.y = positions.array[this.streamingIndex];
      color.g = colors ? colors.array[this.streamingIndex] : 0.5;
      this.streamingIndex++;

      position.z = positions.array[this.streamingIndex];
      color.b = colors ? colors.array[this.streamingIndex] : 0.0;
      this.streamingIndex++;

      points.push({position: position, color: color});
    }

    this.pointCloud.addPoints(points);
  }

  /**
   *
   * @param path
   * @private
   */
  private loadPlyAsync(path: string): Promise<THREE.BufferGeometry> {
    return new Promise((resolve, reject) => {
      const loader = new PLYLoader();
      loader.load( path, (geometry: THREE.BufferGeometry) => {
        resolve(geometry);
      }, (event) => {
        console.log(event);
      }, (error) => {
        reject(error);
      });
    });
  }
}
