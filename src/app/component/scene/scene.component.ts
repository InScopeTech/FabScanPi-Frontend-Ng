import { Component, OnInit } from '@angular/core';
import { RenderService } from "../../service/render.service";
import { ScanTestService } from "../../service/scan.test.service";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})

/**
 * @class SceneComponent
 */
export class SceneComponent implements OnInit {

  /**
   * @constructor
   * @param scanTest
   */
  constructor(private scanTest: ScanTestService) {}

  ngOnInit(): void {
    RenderService.init();
    this.scanTest.runTest();
  }
}
