import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { BenchMarks } from 'src/app/interfaces/benchmarks';
import { Log } from 'src/app/interfaces/log';
import { BenchmarksService } from 'src/app/services/benchmarks.service';
import { LogsService } from 'src/app/services/logs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-distritos-echarts',
  templateUrl: './distritos-echarts.component.html',
  styleUrls: ['./distritos-echarts.component.css']
})
export class DistritosEchartsComponent implements OnInit {
  
  CoolTheme: any = {
    color: [
      '#b21ab4',
      '#6f0099',
      '#2a2073',
      '#0b5ea8',
      '#17aecc',
      '#b3b3ff',
      '#eb99ff',
      '#fae6ff',
      '#e6f2ff',
      '#eeeeee'
    ],

    title: {
      fontWeight: 'normal',
      color: '#00aecd'
    },

    visualMap: {
      color: ['#00aecd', '#a2d4e6']
    },

    toolbox: {
      color: ['#00aecd', '#00aecd', '#00aecd', '#00aecd']
    },

    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      axisPointer: {
        // Axis indicator, coordinate trigger effective
        type: 'line', // The default is a straight line： 'line' | 'shadow'
        lineStyle: {
          // Straight line indicator style settings
          color: '#00aecd',
          type: 'dashed'
        },
        crossStyle: {
          color: '#00aecd'
        },
        shadowStyle: {
          // Shadow indicator style settings
          color: 'rgba(200,200,200,0.3)'
        }
      }
    },

    // Area scaling controller
    dataZoom: {
      dataBackgroundColor: '#eee', // Data background color
      fillerColor: 'rgba(144,197,237,0.2)', // Fill the color
      handleColor: '#00aecd' // Handle color
    },

    timeline: {
      lineStyle: {
        color: '#00aecd'
      },
      controlStyle: {
        color: '#00aecd',
        borderColor: '00aecd'
      }
    },

    candlestick: {
      itemStyle: {
        color: '#00aecd',
        color0: '#a2d4e6'
      },
      lineStyle: {
        width: 1,
        color: '#00aecd',
        color0: '#a2d4e6'
      },
      areaStyle: {
        color: '#b21ab4',
        color0: '#0b5ea8'
      }
    },

    chord: {
      padding: 4,
      itemStyle: {
        color: '#b21ab4',
        borderWidth: 1,
        borderColor: 'rgba(128, 128, 128, 0.5)'
      },
      lineStyle: {
        color: 'rgba(128, 128, 128, 0.5)'
      },
      areaStyle: {
        color: '#0b5ea8'
      }
    },

    graph: {
      itemStyle: {
        color: '#b21ab4'
      },
      linkStyle: {
        color: '#2a2073'
      }
    },

    map: {
      itemStyle: {
        color: '#c12e34'
      },
      areaStyle: {
        color: '#ddd'
      },
      label: {
        color: '#c12e34'
      }
    },

    gauge: {
      axisLine: {
        lineStyle: {
          color: [
            [0.2, '#dddddd'],
            [0.8, '#00aecd'],
            [1, '#f5ccff']
          ],
          width: 8
        }
      }
    }
  };

  options: EChartsOption;
  theme: string | ThemeOption;
  coolTheme = this.CoolTheme;

  data_result: BenchMarks[];
  data_values: DataValue[] = [];

  log: Log;

  totalEmpresas: number = 0;
  distritos_name: Array<string> = [];

  initOpts: any = {
    renderer: 'svg',
    width: 1200,
    height: 500
  };

  constructor(private benchmarksService: BenchmarksService,
              private router: Router,
              private logService: LogsService) {

    this.log = this.logService.initLog();
                
    this.benchmarksService.getFieldsForBenchMarks('distrito')
    .subscribe({
      next: (dataResult: BenchMarks[]) => {
        this.data_result = dataResult;
        this.data_result.forEach((item: BenchMarks) => {
          this.totalEmpresas += Number(item.count!);
          this.distritos_name.push(item.distrito!);
          this.data_values.push({value: item.count!, name: item.distrito!});
        });

        this.options = {
          title: {
            left: '50%',
            text: 'Empresas por distritos',
            subtext: `Total de empresas ${ this.totalEmpresas }`,
            textAlign: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },

          toolbox: {
              show : true,
              feature : {
                  dataView : { 
                    show: true, 
                    readOnly: false, 
                    title: 'Mostrar datos', 
                    backgroundColor: '#4080FF', 
                    textColor: '#FA6F27',
                    iconStyle: { color: '#2A9EE0' }
                  },
                  restore : { 
                    show: true, 
                    title: 'Actualizar',
                    iconStyle: { color: '#FA8125' }
                  },
                 
                  saveAsImage : { 
                    show: true, 
                    title: 'Guardar como imagen',
                    backgroundColor: '#4080FF',
                    name: 'empresas_por_distritos',
                    type: 'jpeg',
                    iconStyle: { color: '#645CFF' }
                  }
              }
          },
          legend: {
            align: 'auto',
            bottom: 10,
            data: [ ...this.distritos_name ]
          },
          calculable: true,
          series: [
            {
              name: 'Distrito',
              type: 'pie',
              radius: [30, 110],
              roseType: 'area',
              data: [
                ...this.data_values
              ]
            }
          ]
        };

      },
      error: (error: any) =>  {
        this.log.action = 'BenchMarks(distrito)';
        this.log.status = false;
        this.log.message = `(distritos-echarts) Error al conseguir BenchMarks('distrito') ${JSON.stringify(error)}`;
        this.logService.setLog(this.log);
        console.log('Error al conseguir BenchMarks(distrito)');
        alert(error);
      },
      complete: () => console.log("Complete: ", this.data_result)
    })

   }

  ngOnInit(): void {
  }

  onChartEvent(event: any) {
    console.log(event) 
    let distrito = event.name;
    let percent = event.percent;
    let value = event.value;
    console.log(distrito);
    console.log(percent);
    console.log(value);

    Swal.fire({
      title: 'Empresas por distritos',
      html: `<p>El distrito: ${ distrito }</p><p>Tiene ${ value } empresas</p><p>que representa el ${ percent }% de empresas</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "Aceptar",
      confirmButtonText: "Ver empresas"
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.router.navigate(['dashboard/list-companies', { filter: distrito, filterSended: 'true', field: 'Distrito', id: 0, url: '/dashboard/graph-distritos' } ]);
      }
    });
  }

}

class DataValue {
  value: number;
  name: string;
}
