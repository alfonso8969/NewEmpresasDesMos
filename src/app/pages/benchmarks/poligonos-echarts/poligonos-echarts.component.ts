import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BenchMarks } from 'src/app/interfaces/benchmarks';
import { Log } from 'src/app/interfaces/log';
import { BenchmarksService } from 'src/app/services/benchmarks.service';
import { LogsService } from 'src/app/services/logs.service';
import Swal from 'sweetalert2';

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
  log: Log;

  constructor(private benchmarksService: BenchmarksService,
              private router: Router,
              private logService: LogsService) {
    this.log = this.logService.initLog();
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
            toolbox: {
              show: true,
              feature: {
                dataView: {
                  show: true,
                  readOnly: false,
                  title: 'Mostrar datos',
                  backgroundColor: '#4080FF',
                  textColor: '#FA6F27',
                  iconStyle: { color: '#2A9EE0' }
                },
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
                  name: 'empresas_por_poligonos',
                  type: 'png',
                  iconStyle: { color: '#645CFF' }
                }
              }
            },
            xAxis: [
              {
                type: 'category',
                data: [...this.poligonos_name],
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
              data: [...this.data_count]
            }]
          }

        },
        error: (error: any) => {
          this.log.action = 'BenchMarks(polígonos)';
          this.log.status = false;
          this.log.message = `(polígonos-echarts) Error al conseguir BenchMarks('polígonos') ${JSON.stringify(error)}`;
          this.logService.setLog(this.log);
          console.log('Error al conseguir BenchMarks(polígonos)', error);
          alert('Error al conseguir BenchMarks(polígonos)');
        },
        complete: () => console.log("Complete: ", this.data_result)
      });
  }

  ngOnInit(): void {
  }

  public onChartEvent(event: any): void {
    console.log(event) 
    let poligono = event.name;
    let value = event.value;
    console.log(poligono);
    console.log(value);
    Swal.fire({
      title: 'Empresas por polígonos',
      html: `<p>El polígono: ${ poligono }</p><p>Tiene ${ value } empresas</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "Aceptar",
      confirmButtonText: "Ver empresas"
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.router.navigate(['dashboard/list-companies', { filter: poligono, filterSended: 'true', field: 'Polígono', id: 0, url: '/dashboard/graph-poligonos' } ]);
      }
    });
  }

}
