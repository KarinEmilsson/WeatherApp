import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-risk',
  templateUrl: 'risk.page.html',
  styleUrls: ['risk.page.scss']
})
export class RiskPage implements OnInit {

  private weatherChart = Chart;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() { }
}
