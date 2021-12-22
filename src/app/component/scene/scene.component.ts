import { Component, OnInit } from '@angular/core';
import { RenderService } from "../../service/render.service";
import { ScanTestService } from "../../service/scan.test.service";
import {MatSliderChange} from "@angular/material/slider";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})

/**
 * @class SceneComponent
 */
export class SceneComponent implements OnInit {

  private static testSceneLoaded: boolean = false;

  public navOpened: boolean = true;
  /**
   * @constructor
   * @param scanTest
   */
  constructor(private scanTest: ScanTestService) {}

  ngOnInit(): void {
    RenderService.init();
    if (!SceneComponent.testSceneLoaded){
      this.scanTest.runTest();
      SceneComponent.testSceneLoaded = true;
    }
  }

  onNavToggle(): void {
    this.navOpened = !this.navOpened;
    const interval = setInterval(() => {
      RenderService.setWidthScale(this.navOpened ? RenderService.WIDTH_SCALE_NAV_OPENED : RenderService.WIDTH_SCALE_NAV_COLLAPSED);
      RenderService.resize();
      clearInterval(interval);
    }, 1000);
  }

  onPointSizeChange(event: MatSliderChange){
    this.scanTest.getPointCloud().getPointCloudChunks().forEach(pointCloudChunk => {
      pointCloudChunk.getMaterial().size = event.value || 0.1;
    })
  }
}
