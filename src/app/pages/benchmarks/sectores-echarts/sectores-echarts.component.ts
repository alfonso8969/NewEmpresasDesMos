import { Component, OnInit } from '@angular/core';
import { BenchMarks } from 'src/app/interfaces/benchmarks';
import { BenchmarksService } from 'src/app/services/benchmarks.service';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { Log } from 'src/app/interfaces/log';
import { LogsService } from 'src/app/services/logs.service';

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
  message: string = '';
  log: Log;

  constructor(private benchmarksService: BenchmarksService,
              private router: Router,
              private logService: LogsService) {
                
    this.log = this.logService.initLog();
    this.benchmarksService.getFieldsForBenchMarks('sector')
    .subscribe({
      next: (dataResult: BenchMarks[]) => {
        this.data_result = dataResult;
        this.data_result.forEach((item: BenchMarks) => {
          this.dataAxis.push(item.sector_id!);
          this.data_count.push(item.count!);
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
        for (const element of data) {
          dataShadow.push(yMax);
        }

        this.options = {
          title: {
            text: 'Click para información',
          },
          toolbox: {
              show : true,
              feature : {
                magicType: { 
                  show: true, 
                  type: ['line', 'bar'],
                  title: { line: 'Cambiar a lineas', bar: 'Cambiar a barras' },
                  iconStyle: { color: '#24F52E' }
                },
                restore: { 
                  show: true,
                  title: 'Actualizar',
                  iconStyle: { color: '#FA8125' }
                },
                  saveAsImage : { 
                    show: true, 
                    title: 'Guardar como imagen',
                    backgroundColor: '#4080FF',
                    name: 'empresas_por_sectores',
                    type: 'png',
                    iconStyle: { color: '#645CFF' }
                  }
              }
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
        this.log.action = 'BenchMarks(sectores)';
        this.log.status = false;
        this.log.message = `(sectores-echarts) Error al conseguir BenchMarks('sectores') ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log('Error al conseguir BenchMarks(sectores)', error);
        alert('Error al conseguir BenchMarks(sectores)');
      },
      complete: () => console.log("Complete: ", this.data_result)
    });
   }

  ngOnInit(): void {

  }

  onChartEvent(event: any, type: string) {
    let sector = this.data_result.find((item: BenchMarks) => item.sector_id == event.name);
    console.log("Sector:", sector);
    Swal.fire({
      title: 'Empresas por sectores',
      html: `<p>El sector: ${ sector?.sector }</p><p>nº sector ${ sector?.sector_id }</p><p>Tiene ${ sector?.count } empresas</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "Aceptar",
      confirmButtonText: "Ver empresas"
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.router.navigate(['dashboard/list-companies', { filter: sector?.sector, filterSended: 'true', field: 'Sector', id: sector?.sector_id, url: '/dashboard/graph-sectores' } ]);
      }
    });
  }

  onChartMouseOver(event: any, type: string) {
    let sector = this.data_result.find((item: BenchMarks) => item.sector_id == event.name);
    this.message = `El sector: ${ sector?.sector }
                    Nº sector ${ sector?.sector_id }
                    Tiene ${ sector?.count } empresas`;
  }
}
