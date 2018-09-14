// src/components/grafico/grafico.js

import "./grafico.scss"
// import * as echarts from "echarts"

class Grafico {
    constructor() {
        this._componentName = this.constructor.name
    }

    _Option() {
        let option = (id => {
            switch (id) {
                case "grafico__remit": {
                    return this._remitOption()
                }
                case "grafico__giornaliero": {
                    return this._remitGiornalieraOption()
                }
                case "grafico__zone": {
                    return this._remitZoneOption()
                }
                case "grafico__giornaliero__zone": {
                    return this._remitGiornalieroZoneOption()
                }
                default: {
                    console.log("Invalid choice")
                    break
                }
            }
        })(this.elId)

        let globalOption = {
            dataset: {
                dimensions: [],
                source: [],
            },
            backgroundColor: this.background,
            title: this.title,
            animationDuration: 800,
            animationEasing: "elasticOut",
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
            tooltip: {
                trigger: "axis",
                // backgroundColor: "rgba(0, 0, 0, 0.7)",
                textStyle: {
                    fontSize: 12,
                },
                axisPointer: {
                    type: "cross",
                    label: {
                        backgroundColor: "#2b2b2bd6",
                        fontSize: 10,
                        shadowColor: "#25252599",
                        shadowBlur: 10,
                        // show: false,
                    },
                    crossStyle: {
                        type: "solid",
                        color: "rgba(230, 230, 230, 0.6)",
                        textStyle: {
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            fontSize: 11,
                        },
                    },
                },
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
                show: true,
                // orient: "vertical",
                right: 130,
                // top: "center",
                top: 20,
                showTitle: false,
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
                        show: false,
                        type: ["line", "bar"],
                        title: {
                            line: "Switch Line Chart",
                            bar: "Switch Bar Chart",
                            stack: "Stack",
                            tiled: "Tile",
                        },
                    },
                    restore: {
                        show: false,
                        title: "Restore",
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image",
                        lang: ["Right Click to Save Image"],
                    },
                },
            },
            dataZoom: [
                {
                    type: "slider",
                    realtime: false,
                    xAxisIndex: 0,
                    start: 60,
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
            yAxis: {
                name: "MWh",
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
                        type: "dashed",
                    },
                },
            },
        }

        return Object.assign(globalOption, option)
    }

    _remitOption() {
        let option = {
            // tooltip: {
            //     trigger: "item",
            //     triggerOn: "click",
            //     hideDelay: 40,
            //     backgroundColor: "rgba(0, 0, 0, 0.7)",
            //     textStyle: {
            //         fontSize: 12,
            //     },
            //     axisPointer: {
            //         type: "shadow",
            //         snap: true,
            //         crossStyle: {
            //             color: "rgba(230, 230, 230, 0.6)",
            //             type: "solid",
            //             textStyle: {
            //                 backgroundColor: "rgba(0, 0, 0, 0.9)",
            //                 fontSize: 11,
            //             },
            //         },
            //     },
            // },
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
                    onZero: false,
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
                    color: function (value, index) {
                        return appState.$data.get() == value.substring(0, 10) ? "#5aaafa" : "#DADBDD"
                    },
                    // color: "#DADBDD",
                    fontSize: 10,
                    rotate: 45,
                },
            },
            series: [],
        }
        return option
    }

    _remitGiornalieraOption() {
        let option = {
            xAxis: {
                name: "Data-Ora",
                type: "category",
                nameGap: 0,
                boundaryGap: false,
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
                    onZero: false,
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
                    // color: "#DADBDD",
                    color: function (value, index) {
                        return appState.$data.get() == value.substring(0, 10) ? "#5aaafa" : "#DADBDD"
                    },
                    fontSize: 9,
                    rotate: 45,
                    // formatter: function (value) {
                    //     return echarts.format.formatTime('yyyy-MM-dd hh', value);
                    // }
                    formatter: function(value) {
                        let label
                        let m = value.match(/(\d+)-(\d+)-(\d+)\s+(\d+)/)
                        if (m[4] == "00") {
                            label = `${m[1]}-${m[2]}-${m[3]}`
                        } else {
                            label = `${m[4]}`
                        }
                        return label
                    },
                },
            },
            dataZoom: [
                {
                    type: "slider",
                    realtime: false,
                    xAxisIndex: 0,
                    start: 89,
                    end: 95,
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
            series: [],
        }

        return option
    }

    _remitZoneOption() {
        let option = {
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
                    color: function (value, index) {
                        return appState.$data.get() == value.substring(0, 10) ? "#5aaafa" : "#DADBDD"
                    },
                    fontSize: 9,
                    rotate: 45,
                },
            },
            series: [],
            color: ["#ADED5F", "#3ABDEC", "#F0563C", "#3A8E78", "#FD8E32", "#F93B1C", "#6AB015", "#2C81A5", "#BE2A14", "#245749", "#c4ccd3"],
        }

        return option
    }

    _remitGiornalieroZoneOption() {
        let option = {
            xAxis: {
                name: "Data-Ora",
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
                    onZero: false,
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
                    color: function (value, index) {
                        return appState.$data.get() == value.substring(0, 10) ? "#5aaafa" : "#DADBDD"
                    },
                    fontSize: 9,
                    rotate: 45,
                    formatter: function(value) {
                        let label
                        let m = value.match(/(\d+)-(\d+)-(\d+)\s+(\d+)/)
                        if (m[4] == "00") {
                            label = `${m[1]}-${m[2]}-${m[3]}`
                        } else {
                            label = `${m[4]}`
                        }
                        return label
                    },
                },
            },
            dataZoom: [
                {
                    type: "slider",
                    realtime: false,
                    xAxisIndex: 0,
                    start: 89,
                    end: 95,
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
            series: [],
            color: ["#ADED5F", "#3ABDEC", "#F0563C", "#3A8E78", "#FD8E32", "#F93B1C", "#6AB015", "#2C81A5", "#BE2A14", "#245749", "#c4ccd3"],
        }

        return option
    }

    _Series() {
        let series = (id => {
            switch (id) {
                case "grafico__remit": {
                    return this._remitTecnologiaSeries()
                }
                case "grafico__giornaliero": {
                    return this._remitTecnologiaGiornalieraSeries()
                }
                case "grafico__zone": {
                    return this._remitZoneSeries()
                }
                case "grafico__giornaliero__zone": {
                    return this._remitGiornalieraZoneSeries()
                }
                default: {
                    console.log("Invalid choice")
                    break
                }
            }
        })(this.elId)

        return series
    }

    _remitTecnologiaSeries() {
        let series = this.dimensions.slice(1, this.dimensions.length).map(dim => {
            return {
                type: "bar",
                stack: "1",
                symbolSize: 1,
                showSymbol: true,
                // barWidth: "20%",
                barMaxWidth: 14,
                // connectNulls: true,
                barCategoryGap: "20%",
                animationDuration: 600,
                // barGap: "90%",
                emphasis: {
                    itemStyle: {
                        shadowColor: "rgba(0, 0, 0, 1)",
                        shadowOffsetX: 3,
                        symbolSize: 5,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset: 0,
                                color: this.colors[`${dim}EmphasisColor2`],
                            },
                            {
                                offset: 0.5,
                                color: this.colors[`${dim}EmphasisColor2`],
                            },
                            {
                                offset: 1,
                                color: this.colors[`${dim}EmphasisColor1`],
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
                                color: this.colors[`${dim}Color1`],
                            },
                            {
                                offset: 0.5,
                                color: this.colors[`${dim}Color2`],
                            },
                            {
                                offset: 1,
                                color: this.colors[`${dim}Color1`],
                            },
                        ]),
                    },
                },
                areaStyle: {
                    normal: {
                        opacity: 0.75,
                    },
                },
            }
        })
        return series
    }

    _remitTecnologiaGiornalieraSeries() {
        let series = this.dimensions.slice(1, this.dimensions.length).map(dim => {
            return {
                type: "line",
                symbolSize: 1,
                showSymbol: true,
                // barWidth: "20%",
                barMaxWidth: 14,
                // connectNulls: true,
                barCategoryGap: "20%",
                animationDuration: 600,
                barGap: "90%",
                emphasis: {
                    itemStyle: {
                        shadowColor: "rgba(0, 0, 0, 1)",
                        shadowOffsetX: 2,
                        symbolSize: 2,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            {
                                offset: 0,
                                color: this.colors[`${dim}EmphasisColor2`],
                            },
                            {
                                offset: 0.5,
                                color: this.colors[`${dim}EmphasisColor2`],
                            },
                            {
                                offset: 1,
                                color: this.colors[`${dim}EmphasisColor1`],
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
                                color: this.colors[`${dim}Color1`],
                            },
                            {
                                offset: 0.5,
                                color: this.colors[`${dim}Color2`],
                            },
                            {
                                offset: 1,
                                color: this.colors[`${dim}Color1`],
                            },
                        ]),
                    },
                },
            }
        })
        return series
    }

    _remitZoneSeries() {
        let series = this.dimensions.slice(1, this.dimensions.length).map(dim => {
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
                    },
                },
            }
        })
        return series
    }

    _remitGiornalieraZoneSeries() {
        let series = this.dimensions.slice(1, this.dimensions.length).map(dim => {
            return {
                type: "line",
                // stack: "1",
                symbolSize: 1,
                showSymbol: true,
                // barWidth: "20%",
                barMaxWidth: 14,
                // connectNulls: true,
                barCategoryGap: "20%",
                animationDuration: 600,
                // barGap: "90%",
                emphasis: {
                    itemStyle: {
                        shadowColor: "rgba(0, 0, 0, 1)",
                        shadowOffsetX: 2,
                        symbolSize: 2,
                        // color: this.colors[`${zona}Color1`],
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
                        // color: this.colors[`${zona}Color2`],
                    },
                },
            }
        })
        return series
    }

    oninit({ attrs, state }) {
        state.dimensions = []
        state.source = []
        // state.dimensions = Object.keys(attrs.remit[0])
        // state.source = attrs.remit

        state.elId = attrs.elId

        state.background = {
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
        }

        state.title = {
            show: true,
            text: attrs.title,
            left: "center",
            y: "100",
            top: "16",
            textStyle: {
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "bolder",
                color: "#F4F5F5",
            },
        }

        state.colors = {
            // termico color
            termicoColor1: "rgb(154, 31, 26)",
            termicoColor2: "rgb(228, 93, 87)",
            termicoEmphasisColor1: "rgb(144, 21, 16)",
            termicoEmphasisColor2: "rgb(228, 93, 87)",
            // pompaggio color
            pompaggioColor1: "rgb(0,92,59)",
            pompaggioColor2: "rgb(22,190,114)",
            pompaggioEmphasisColor1: "rgb(0,84,54)",
            pompaggioEmphasisColor2: "rgb(17,142,85)",
            // idrico color
            idricoColor1: "rgb(0,119,144)",
            idricoColor2: "rgb(69,195,222)",
            idricoEmphasisColor1: "rgb(1,94,113)",
            idricoEmphasisColor2: "rgb(52,162,185)",
            // idrico color
            autoproduttoreColor1: "rgb(85,72,184)",
            autoproduttoreColor2: "rgb(110,96,219)",
            autoproduttoreEmphasisColor1: "rgb(73,58,183)",
            autoproduttoreEmphasisColor2: "rgb(17,142,85)",
            // eolico color
            eolicoColor1: "rgb(15,122,205)",
            eolicoColor2: "rgb(84,159,216)",
            eolicoEmphasisColor1: "rgb(3,107,186)",
            eolicoEmphasisColor2: "rgb(59,141,204)",
            // solare color
            solareColor1: "rgb(239,212,38)",
            solareColor2: "rgb(255,245,181)",
            solareEmphasisColor1: "rgb(209,163,19)",
            solareEmphasisColor2: "rgb(217,217, 87)",
            // geotermico color
            geotermicoColor1: "rgb(100,61,22)",
            geotermicoColor2: "rgb(178,123,67)",
            geotermicoEmphasisColor1: "rgb(89, 53, 16)",
            geotermicoEmphasisColor2: "rgb(217, 217, 87)",
        }
    }

    view({ state }) {
        return m(`.grafico#${state.elId}`)
    }

    oncreate({ attrs, state }) {
        let myChart = echarts.init(document.getElementById(state.elId), "dark")
        let option = this._Option()
        window.onresize = myChart.resize

        myChart.setOption(option, true)

        attrs.data.react(resp => {
            resp.then(remit => {
                switch (state.elId) {
                    case "grafico__remit":
                        state.dimensions = Object.keys(remit.tec_daily[0])
                        state.source = remit.tec_daily
                        break
                    case "grafico__giornaliero":
                        state.dimensions = Object.keys(remit.tec_hourly[0])
                        state.source = remit.tec_hourly
                        break
                    case "grafico__zone":
                        state.dimensions = Object.keys(remit.zona_daily[0])
                        state.source = remit.zona_daily
                        break
                    case "grafico__giornaliero__zone":
                        state.dimensions = Object.keys(remit.zona_hourly[0])
                        state.source = remit.zona_hourly
                        break
                }

                myChart.setOption({
                    dataset: {
                        dimensions: state.dimensions,
                        source: state.source,
                    },
                    series: this._Series(),
                })
            }).catch(err => {
                console.log(`Errore richiesta json remit  ${url}`, err)
            })
        })

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
