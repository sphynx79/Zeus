// src/components/grafico/grafico.js

import "./grafico_zone.scss"

class GraficoZone {
    constructor() {
        this._componentName = this.constructor.name
        this.zone = ["brnn", "cnor", "csud", "fogn", "nord", "prgp", "rosn", "sard", "sici", "sud"]
        this.colors = {
            // brnn color
            brnnColor1: "#ADED5F",
            // cnor color
            cnorColor1: "#3ABDEC",
            // csud color
            csudColor1: "#F0563C",
            // fogn color
            fognColor1: "#3A8E78",
            // nord color
            nordColor1: "#FD8E32",
            // prgp color
            prgpColor1: "#F93B1C",
            // rosn color
            rosnColor1: "#6AB015",
            // sard color
            sardColor1: "#2C81A5",
            // sici color
            siciColor1: "#BE2A14",
            // sud color
            sudColor1: "#245749",
            // termicoColor2: "rgb(228, 93, 87)",
            // termicoEmphasisColor1: "rgb(144, 21, 16)",
            // termicoEmphasisColor2: "rgb(228, 93, 87)",
          
        }
    }

    view() {
        return m("#grafico__zone")
    }

    setSerie() {
        let series = this.zone.map(zona => {
            return {
                // TERMICO
                type: "line",
                stack: "1",
                symbolSize: 1,
                showSymbol: true,
                animationDuration: 600,
                // color: this.colors[`${zona}Color1`],
                // barWidth: "30%",
                emphasis: {
                    itemStyle: {
                        shadowColor: "rgba(0, 0, 0, 1)",
                        shadowOffsetX: 2,
                        // color:  this.colors[`${zona}Color1`],
                        symbolSize: 5,
                    },
                },
                lineStyle: {
                    width: 0.5,
                    opacity: 0.8,
                    // color: this.colors[`${zona}Color1`]
                },
                areaStyle: {
                    normal: {
                        opacity: 0.75,
                         // color: this.colors[`${zona}Color1`],
                    }
                },
            }
        })
        return series
    }

    oncreate({ attrs, state }) {
        var myChart = echarts.init(document.getElementById("grafico__zone"), "dark")

        var option = {
            title: {
                show: true,
                text: "Totale indisponibilità programmate lungo termine per zona",
                left: "center",
                y: "100",
                top: "16",
                textStyle: {
                    fontSize: 20,
                    fontStyle: "italic",
                    fontWeight: "bolder",
                    color: "#F4F5F5",
                },
            },
            backgroundColor: {
                type: "linear",
                x: -1,
                y: 0,
                x2: 2,
                y2: 0,
                colorStops: [
                    {
                        offset: 0,
                        color: "rgba(28, 30, 40, 0.9)",
                    },
                    {
                        offset: 0.4,
                        color: "rgba(28, 30, 40, 0.9)",
                    },
                    {
                        offset: 0.5,
                        color: "rgba(50, 50, 50, 0.9)",
                    },
                    {
                        offset: 0.7,
                        color: "rgba(28, 30, 40, 0.9)",
                    },
                    {
                        offset: 1,
                        color: "rgba(28, 30, 40, 0.9)",
                    },
                ],
            },
            animationDuration: 800,
            animationEasing: "elasticOut",
            dataset: {
                dimensions: ["data", "brnn", "cnor", "csud", "fogn", "nord", "prgp", "rosn", "sard", "sici", "sud"],
                source: attrs.remit,
            },
            tooltip: {
                trigger: 'axis',
                // triggerOn: "click",
                // hideDelay: 40,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                textStyle: {
                    fontSize: 12,
                },
                axisPointer: {
                    type: "cross",
                    // type: "shadow",
                    // snap: true,
                    crossStyle: {
                        color: "rgba(230, 230, 230, 0.6)",
                        // type: "solid",
                        textStyle: {
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            fontSize: 11,
                        },
                    },
                },
                // formatter: function(params) {
                //     console.log(params)
                // return params.value
                // },
            },
            legend: {
                top: "48px",
                // itemWidth: 18,
                // itemHeight: 8,
                padding: 15,
                formatter: name => {
                    return name[0].toUpperCase() + name.slice(1)
                },
                textStyle: {
                    color: "#F4F5F5",
                    fontWeight: "bold",
                },
            },
            toolbox: {
                show: true,
                orient: "vertical",
                right: 30,
                top: "center",
                height: 200,
                feature: {
                    mark: {
                        show: true,
                    },
                    dataView: {
                        show: false,
                        readOnly: false,
                        title: "Data View",
                        lang: ["Data View", "Close", "Refresh"],
                    },
                    magicType: {
                        show: true,
                        type: ["line", "bar"],
                        title: {
                            line: "Switch Line Chart",
                            bar: "Switch Bar Chart",
                            stack: "Stack",
                            tiled: "Tile",
                        },
                    },
                    restore: {
                        show: true,
                        title: "Restore",
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image",
                        lang: ["Right Click to Save Image"],
                    },
                },
            },
            calculable: true,
            grid: {
                borderWidth: 1,
                top: 116,
                bottom: 95,
                height: "50%",
                textStyle: {
                    color: "#90979c",
                },
            },
            dataZoom: [
                {
                    type: "slider",
                    xAxisIndex: 0,
                    start: 0,
                    end: 100,
                    bottom: "10",
                    backgroundColor: "rgba(47,69,84,0)",
                    borderColor: "rgba(250,250,250,0.5)",
                    fillerColor: "rgba(47,69,84,0.3)",
                    dataBackground: {
                        lineStyle: {
                            color: "#000000",
                        },
                        areaStyle: {
                            color: "#FFF",
                        },
                    },
                },
                {
                    type: "inside",
                    xAxisIndex: 0,
                    start: 0,
                    end: 100,
                },
            ],
            xAxis: {
                name: "Data",
                type: "category",
                boundaryGap: false,
                nameTextStyle: {
                    color: "#DADBDD",
                    fontSize: 12,
                    padding: [0, 0, -24, 0],
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#B2B4B8",
                    },
                },
                axisLine: {
                    symbol: ["none", "arrow"],
                    symbolSize: [8, 14],
                    symbolOffset: [0, 12],
                    lineStyle: {
                        color: "#DADBDD",
                    },
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: "#DADBDD",
                    },
                },
                axisLabel: {
                    color: "#DADBDD",
                    fontSize: 10,
                    rotate: 45,
                },
            },
            yAxis: {
                name: "Mw/h",
                type: "value",
                // boundaryGap: [0, "40%"],
                splitNumber: 8,
                nameGap: 20,
                minInterval: 40,
                nameTextStyle: {
                    color: "#DADBDD",
                    fontSize: 12,
                    padding: [0, 0, 0, -30],
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: "#DADBDD",
                    },
                },
                axisLine: {
                    symbol: ["none", "arrow"],
                    symbolSize: [8, 14],
                    symbolOffset: [0, 11],
                    lineStyle: {
                        color: "#DADBDD",
                    },
                },
                axisLabel: {
                    color: "#DADBDD",
                    fontSize: 12,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#8B8E94",
                        type: "solid",
                    },
                },
            },
            series: this.setSerie(),
            color: ["#ADED5F","#3ABDEC", '#F0563C', '#3A8E78', '#FD8E32','#F93B1C',  '#6AB015', '#2C81A5','#BE2A14', '#245749', '#c4ccd3'],
        }

        myChart.setOption(option, true)
        // myChart.showLoading()
        // m.request({
        //     method: "GET",
        //     url: "http://127.0.0.1:80/api/report_centrali/20-03-2018/20-04-2018",
        // })
        //     .then(response => {
        //         myChart.hideLoading()
        //         myChart.setOption({
        //             dataset: {
        //                 dimensions: ["data", "termico", "pompaggio", "idrico", "autoproduttore", "eolico", "solare", "geotermico"],
        //                 source: response,
        //             },
        //         })
        //     })
        //     .catch(err => {
        //         console.log("Errore richiesta json", err)
        //     })

        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: attrs,
                state: state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default GraficoZone
