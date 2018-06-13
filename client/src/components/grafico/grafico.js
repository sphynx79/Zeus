// src/components/grafico/grafico.js

import "./grafico.scss"

var echarts = require("echarts/lib/echarts")
import "echarts/lib/chart/bar"
import "echarts/lib/chart/line"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title"
import "echarts/lib/component/legendScroll"
import "echarts/lib/component/legend"
import "echarts/lib/component/dataZoom"
import "echarts/lib/component/dataZoomInside"
import "echarts/lib/component/dataZoomSelect"
import "echarts/lib/component/toolbox"
import "echarts/lib/component/dataset"

// import * as echarts from "echarts"

class Grafico {
    constructor() {
        this._componentName = this.constructor.name
        this.tecnologie = ["termico", "pompaggio", "idrico", "autoproduttore", "eolico", "solare", "geotermico"]
        // termico color
        this.termicoColor1 = "rgb(154, 31, 26)"
        this.termicoColor2 = "rgb(228, 93, 87)"
        this.termicoEmphasisColor1 = "rgb(144, 21, 16)"
        this.termicoEmphasisColor2 = "rgb(228, 93, 87)"
        // pompaggio color
        this.pompaggioColor1 = "rgb(0,92,59)"
        this.pompaggioColor2 = "rgb(22,190,114)"
        this.pompaggioEmphasisColor1 = "rgb(0,84,54)"
        this.pompaggioEmphasisColor2 = "rgb(17,142,85)"
        // idrico color
        this.idricoColor1 = "rgb(0,119,144)"
        this.idricoColor2 = "rgb(69,195,222)"
        this.idricoEmphasisColor1 = "rgb(1,94,113)"
        this.idricoEmphasisColor2 = "rgb(52,162,185)"
        // idrico color
        this.autoproduttoreColor1 = "rgb(85,72,184)"
        this.autoproduttoreColor2 = "rgb(110,96,219)"
        this.autoproduttoreEmphasisColor1 = "rgb(73,58,183)"
        this.autoproduttoreEmphasisColor2 = "rgb(17,142,85)"
        // eolico color
        this.eolicoColor1 = "rgb(15,122,205)"
        this.eolicoColor2 = "rgb(84,159,216)"
        this.eolicoEmphasisColor1 = "rgb(3,107,186)"
        this.eolicoEmphasisColor2 = "rgb(59,141,204)"
        // solare color
        this.solareColor1 = "rgb(239,212,38)"
        this.solareColor2 = "rgb(255,245,181)"
        this.solareEmphasisColor1 = "rgb(209,163,19)"
        this.solareEmphasisColor2 = "rgb(217,217, 87)"
        // geotermico color
        this.geotermicoColor1 = "rgb(100,61,22)"
        this.geotermicoColor2 = "rgb(178,123,67)"
        this.geotermicoEmphasisColor1 = "rgb(89, 53, 16)"
        this.geotermicoEmphasisColor2 = "rgb(217, 217, 87)"
    }

    view() {
        return m("#grafico")
    }

    setSerie() {
        let series = this.tecnologie.map(tec => {
            return {
                // TERMICO
                type: "bar",
                stack: "1",
                barWidth: "30%",
                emphasis: {
                    itemStyle: {
                        shadowColor: "rgba(0, 0, 0, 1)",
                        shadowOffsetX: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset: 0,
                                color: eval(`this.${tec}EmphasisColor1`),
                            },
                            {
                                offset: 0.5,
                                color: eval(`this.${tec}EmphasisColor2`),
                            },
                            {
                                offset: 1,
                                color: eval(`this.${tec}EmphasisColor1`),
                            },
                        ]),
                    },
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                        },
                        barBorderWidth: "0.4",
                        barBorderColor: "#000",
                        opacity: 1,
                        shadowColor: "rgba(0, 0, 0, 0.7)",
                        shadowBlur: 6,
                        shadowOffsetX: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset: 0,
                                color: eval(`this.${tec}Color1`),
                            },
                            {
                                offset: 0.5,
                                color: eval(`this.${tec}Color2`),
                            },
                            {
                                offset: 1,
                                color: eval(`this.${tec}Color1`),
                            },
                        ]),
                    },
                },
            }
        })
        return series
    }

    oncreate({ attrs, state }) {
        var myChart = echarts.init(document.getElementById("grafico"), "dark")

        var option = {
            title: {
                show: true,
                text: "Totale indisponibilità programmate lungo termine per tecnologia",
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
            animationDuration: 1200,
            animationEasing: "elasticOut",
            dataset: {
                dimensions: ["data", "termico", "pompaggio", "idrico", "autoproduttore", "eolico", "solare", "geotermico"],
                source: attrs.remit,
            },
            tooltip: {
                trigger: "item",
                triggerOn: "click",
                hideDelay: 40,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                textStyle: {
                    fontSize: 12,
                },
                axisPointer: {
                    // type: "cross",
                    type: "shadow",
                    snap: true,
                    crossStyle: {
                        color: "rgba(230, 230, 230, 0.6)",
                        type: "solid",
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
                itemWidth: 18,
                itemHeight: 8,
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
                show: false,
                orient: "vertical",
                left: "right",
                top: "center",
                feature: {
                    mark: {
                        show: true,
                    },
                    dataView: {
                        show: true,
                        readOnly: false,
                        title: "Data View",
                        lang: ["Data View", "Close", "Refresh"],
                    },
                    magicType: {
                        show: true,
                        type: ["line", "bar", "stack", "tiled"],
                        title: {
                            line: "Switch to Line Chart",
                            bar: "Switch to Bar Chart",
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
                        title: "Save as Image",
                        lang: ["Right Click to Save Image"],
                    },
                },
            },
            calculable: true,
            grid: {
                borderWidth: 1,
                top: 126,
                bottom: 95,
                height: "54%",
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
                    bottom: "20",
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
                nameGap: 0,
                nameTextStyle: {
                    color: "#DADBDD",
                    fontSize: 12,
                    padding: [0, 0, -24, 0],
                },
                splitLine: {
                    show: false,
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
                boundaryGap: [0, "50%"],
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
                        type: "dashed",
                    },
                },
            },
            series: this.setSerie(),
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

export default Grafico
