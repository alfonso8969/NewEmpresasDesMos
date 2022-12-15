import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BenchMarks } from 'src/app/interfaces/benchmarks';
import { BenchmarksService } from 'src/app/services/benchmarks.service';

@Component({
  selector: 'app-poligonos-echarts',
  templateUrl: './poligonos-echarts.component.html',
  styleUrls: ['./poligonos-echarts.component.css']
})
export class PoligonosEchartsComponent implements OnInit {

  data_result: BenchMarks[];
  poligonos_name: Array<string> = [];
  data_count: Array<number> = [];

  initOpts: any = {
    renderer: 'svg',
    width: 1000,
    height: 500
  };

  options: EChartsOption;

  constructor(private benchmarksService: BenchmarksService) {
    this.benchmarksService.getFieldsForBenchMarks('poligono')
    .subscribe({
      next: (dataResult: BenchMarks[]) => {
        this.data_result = dataResult;
        this.data_result.forEach((item: BenchMarks) => {
          this.data_count.push(item.count!);
          this.poligonos_name.push(item.poligono!);
        });

        this.options = {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: [ ...this.poligonos_name ],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: 'Nº Empresas',
            type: 'bar',
            barWidth: '70%',
            data: [ ...this.data_count ]
          }]
        }

      },
      error: (error: any) =>  {
        console.log(error);
        alert(error);
      },
      complete: () => console.log("Complete: ", this.data_result)
    });
   }

  ngOnInit(): void {
  }

}
