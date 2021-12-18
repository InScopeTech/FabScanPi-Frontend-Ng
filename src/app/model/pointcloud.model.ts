import * as THREE from 'three';
import { Point } from "./point.model";
import { PointCloudChunk } from './pointcloud.chunk.model';
import { RenderService } from "../service/render.service";

/**
 * @class PointCloud
 * This class is a model representation for a point cloud.
 * It holds an array of point cloud chunks.
 */
export class PointCloud {
  private currentChunk: PointCloudChunk;
  private pointCloudChunks: Array<PointCloudChunk> = [];
  private readonly pointCloudChunkSize: number = 0;

  /**
   * @constructor
   * Constructs a PointCloud and allocate the first chunk
   * @param chunkSize: Define a fixed size for the chunks
   */
  constructor(chunkSize: number) {
    this.pointCloudChunkSize = chunkSize;
    this.pointCloudChunks.push(new PointCloudChunk(this.pointCloudChunkSize, "FabScan PointCloudChunk #0"));
    this.currentChunk = this.pointCloudChunks[0];
  }

  /**
   * Adds a point to the current chunk.
   * If size exceeds the chunkSize, a new chunk will be allocated.
   * @param points
   */
  public addPoints(points: Array<Point>): void {
    let pointsBufferSize: number = points.length * 3;

    if (this.currentChunk.getBufferIndex() + pointsBufferSize <= this.currentChunk.getBufferSize()) {
      this.currentChunk.addPoints(points);
    }
    else {
      this.pointCloudChunks.push(new PointCloudChunk(
        this.pointCloudChunkSize, "FabScan PointCloudChunk #" + this.pointCloudChunks.length
      ));

      this.currentChunk.update();
      this.currentChunk = this.pointCloudChunks[this.pointCloudChunks.length - 1];
      this.onPointCloudChunkSwap();
      this.addPoints(points);
    }
  }

  /**
   * @private
   * This functions gets called on chunk swap. It will transform the chunk points and add it to the scene
   * for rendering.
   */
  private onPointCloudChunkSwap(): void {
    this.currentChunk.getPoints().rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI / 2);
    RenderService.getScene().add(this.currentChunk.getPoints());
  }

  /**
   * Gets the current chunk
   */
  public getCurrentPointCloudChunk(): PointCloudChunk {
    return this.currentChunk;
  }

  /**
   * Gets the chunk array
   */
  public getPointCloudChunks(): Array<PointCloudChunk> {
    return this.pointCloudChunks;
  }
}
