import * as THREE from 'three';
import {Point} from "./point.model";

/**
 * @class PointCloudChunk
 */
export class PointCloudChunk {
  private readonly points: THREE.Points;
  private bufferIndex: number = 0;

  private lastUpdate: number = 0;
  private filledSize: number = 0;
  private readonly maxSize: number = 0;
  private readonly bufferSize: number = 0;

  private readonly updateInterval: number = 100;
  private readonly positionBuffer: Float32Array;
  private readonly colorBuffer: Float32Array;

  private readonly renderMaterial: THREE.PointsMaterial;
  private readonly bufferGeometry: THREE.BufferGeometry;

  private readonly debugMode: boolean = true;
  private readonly debugColor!: THREE.Color;

  /**
   * @constructor
   * @param size
   * @param name
   */
  constructor(size: number, name: string) {
    this.maxSize = size;
    this.bufferSize = this.maxSize * 3;

    this.bufferGeometry = new THREE.BufferGeometry();

    this.positionBuffer = new Float32Array(this.bufferSize);
    this.bufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( this.positionBuffer, 3 ));

    this.colorBuffer = new Float32Array(this.bufferSize);
    this.bufferGeometry.setAttribute( 'color', new THREE.BufferAttribute( this.colorBuffer, 3 ));

    this.renderMaterial = new THREE.PointsMaterial({vertexColors: true, size: 0.1, fog: true});

    this.points = new THREE.Points(this.bufferGeometry,  this.renderMaterial);
    this.points.name = name;

    this.bufferGeometry.setDrawRange(0, this.bufferIndex);

    if (this.debugMode)
      this.debugColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  }

  /**
   *
   * @param points
   */
  public addPoints(points: Array<Point>): void {
    let positions = this.bufferGeometry.attributes['position'].array as Float32Array;
    let colors = this.bufferGeometry.attributes['color'].array as Float32Array;

    let pointColor: THREE.Color = this.debugColor;

    points.forEach(point => {
      if (!this.debugMode)
        pointColor = point.color;

      positions[this.bufferIndex] = point.position.x;
      colors[this.bufferIndex] = pointColor.r;
      this.bufferIndex++;
      positions[this.bufferIndex] = point.position.y;
      colors[this.bufferIndex] = pointColor.g;
      this.bufferIndex++;
      positions[this.bufferIndex] = point.position.z;
      colors[this.bufferIndex] = pointColor.b;
      this.bufferIndex++;

      this.filledSize++;
    });

    if (Date.now() >= this.lastUpdate + this.updateInterval)
      this.update();
  }

  /**
   *
   */
  public update(): void {
    (this.bufferGeometry.attributes['position'] as THREE.BufferAttribute).needsUpdate = true;
    (this.bufferGeometry.attributes['color'] as THREE.BufferAttribute).needsUpdate = true;
    this.bufferGeometry.setDrawRange(0, this.bufferIndex);
    this.bufferGeometry.computeBoundingSphere();
    this.lastUpdate = Date.now();
  }

  /**
   *
   */
  public dispose(): void {
    this.bufferGeometry.dispose();
    this.renderMaterial.dispose();
  }

  /**
   *
   */
  public getBufferIndex(): number {
    return this.bufferIndex;
  }

  /**
   *
   */
  public getSize(): number {
    return this.filledSize;
  }

  /**
   *
   */
  public getMaxSize(): number {
    return this.maxSize;
  }

  /**
   *
   */
  public getBufferSize(): number {
    return this.bufferSize;
  }

  /**
   *
   */
  public getPositionBuffer(): Float32Array {
    return this.bufferGeometry.attributes['position'].array as Float32Array;
  }

  /**
   *
   * @param buffer
   */
  public setPositionBuffer(buffer: Float32Array): void {
    (this.bufferGeometry.attributes['position'].array as Float32Array).set(buffer);
    this.bufferIndex = buffer.length;
  }

  /**
   *
   */
  public getColorBuffer(): Float32Array{
    return this.bufferGeometry.attributes['color'].array as Float32Array;
  }

  /**
   *
   * @param buffer
   */
  public setColorBuffer(buffer: Float32Array): void {
    (this.bufferGeometry.attributes['color'].array as Float32Array).set(buffer);
    this.bufferIndex = buffer.length;
  }

  /**
   *
   */
  public getPoints(): THREE.Points {
    return this.points;
  }
}
