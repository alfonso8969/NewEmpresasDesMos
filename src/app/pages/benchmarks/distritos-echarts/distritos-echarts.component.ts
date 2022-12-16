import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { BenchMarks } from 'src/app/interfaces/benchmarks';
import { BenchmarksService } from 'src/app/services/benchmarks.service';

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
  data_values: data_value[] = [];

  totalEmpresas: number = 0;
  distritos_name: Array<string> = [];

  initOpts: any = {
    renderer: 'svg',
    width: 1200,
    height: 500
  };

  constructor(private benchmarksService: BenchmarksService) {
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
                    iconStyle: { }
                  },
                  restore : { show: true, title: 'Actualizar'},
                  saveAsImage : { 
                    show: true, 
                    title: 'Guardar como imagen',
                    backgroundColor: '#4080FF',
                    name: 'empresas_por_distritos',
                    type: 'jpeg',
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
        console.log(error);
        alert(error);
      },
      complete: () => console.log("Complete: ", this.data_result)
    })

   }

  ngOnInit(): void {
  }

}

class data_value {
  value: number;
  name: string;
}
