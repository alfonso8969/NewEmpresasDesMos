import { Component, OnInit } from '@angular/core';
import { BenchMarks } from 'src/app/interfaces/benchmarks';
import { BenchmarksService } from 'src/app/services/benchmarks.service';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-sectores-echarts',
  templateUrl: './sectores-echarts.component.html',
  styleUrls: ['./sectores-echarts.component.css']
})
export class SectoresEchartsComponent implements OnInit {

  options: any;
  data_result: BenchMarks[];
  dataAxis: Array<number> = [];
  data_count: Array<number> = [];
  sectores_name: Array<string> = [];
  sector: string = '';
  message: string = '';

  constructor(private benchmarksService: BenchmarksService) {
    this.benchmarksService.getFieldsForBenchMarks('sector')
    .subscribe({
      next: (dataResult: BenchMarks[]) => {
        this.data_result = dataResult;
        this.data_result.forEach((item: BenchMarks) => {
          this.dataAxis.push(item.sector_id!);
          this.data_count.push(item.count!);
          this.sectores_name.push(item.sector!);
        });
        const dataAxis = [
          ...this.dataAxis
        ];
        const data = [
          ...this.data_count
        ];
        const yMax = 100;
        const dataShadow = [];
    
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          dataShadow.push(yMax);
        }
    
        this.options = {
          title: {
            text: 'Click sobre la barra para información sobre el sector',
          },
          xAxis: {
            data: dataAxis,
            axisLabel: {
              inside: true,
              color: '#fff',
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            z: 10,
          },
          yAxis: {
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#999',
            },
          },
          dataZoom: [
            {
              type: 'inside',
            },
          ],
          series: [
            {
              // For shadow
              type: 'bar',
              itemStyle: {
                color: 'rgba(0,0,0,0.05)'
              },
              barGap: '-100%',
              barCategoryGap: '40%',
              data: dataShadow,
              animation: false,
            },
            {
              type: 'bar',
              itemStyle: {
                color: new LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' },
                ]),
              },
              emphasis: {
                itemStyle: {
                  color: new LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' },
                  ]),
                }
              },
              data,
            },
          ],
        };
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

  onChartEvent(event: any, type: string) {
    this.sector = this.sectores_name[event.name];
    Swal.fire({
      title: 'Empresas por sectores',
      html: `<p>El sector: ${ this.sector }</p><p>nº sector ${ event.name }</p><p>tiene ${ event.value } empresas</p>`,	
      icon: 'info',
      confirmButtonText: 'Aceptar'

    })
  }

  onChartMouseOver(event: any, type: string) {
    this.sector = this.sectores_name[event.name];
    this.message = `El sector: ${ this.sector }
                    Nº sector ${ event.name }
                    Tiene ${ event.value } empresas`;
  }
}
