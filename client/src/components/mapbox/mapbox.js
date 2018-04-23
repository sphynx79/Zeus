// src/components/mapbox/mapbox.js

import "./mapbox.scss"
import mapboxgl from "mapbox-gl"
import stream from "mithril/stream"
import Legend from "components/legend/legend.js"
import { derive, react } from "derivable"

var map

class MapBox {
    constructor() {
        if (process.env.NODE_ENV !== "production") {
            this._componentName = this.constructor.name
        }
        this._server = window.location.hostname
        this._accessToken = "pk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjajIzYXRmNnQwMDBuMndwODl1MTdjdG1yIn0.FJ-S1md8BPQtSwTF4SZsMA"
    }

    handleVisibilityUnita() {
        stream.combine(
            (termico, eolico, idrico, autoprod, solare, pompaggi, geotermico, sottotipo, societa, unita) => {
                let filter = ["all"]
                let filter_tecnologia = ["in", "tipo"]
                let filter_sottotipo = ["in", "sottotipo"]
                let filter_societa = ["in", "company"]
                let filter_unita = ["in", "etso"]
                let filterMap = new Map()
                filterMap.set("TERMICO", termico())
                filterMap.set("EOLICO", eolico())
                filterMap.set("IDRICO", idrico())
                filterMap.set("AUTOPRODUTTORE", autoprod())
                filterMap.set("SOLARE", solare())
                filterMap.set("POMPAGGIO", pompaggi())
                filterMap.set("GEOTERMICO", geotermico())

                filterMap.forEach((value, key) => {
                    value && filter_tecnologia.push(key)
                })
                filter.push(filter_tecnologia)

                if (sottotipo().length > 0) {
                    sottotipo().map(value => filter_sottotipo.push(value))
                    filter.push(filter_sottotipo)
                }

                if (societa().length > 0) {
                    societa().map(value => filter_societa.push(value))
                    filter.push(filter_societa)
                }

                if (unita().length > 0) {
                    unita().map(value => filter_unita.push(value))
                    filter.push(filter_unita)
                }

                map.setFilter("centrali", filter)
                map.setFilter("remit_centrali", filter)
            },
            [
                appState.termico_visibility,
                appState.eolico_visibility,
                appState.idrico_visibility,
                appState.autoprod_visibility,
                appState.solare_visibility,
                appState.pompaggi_visibility,
                appState.geotermico_visibility,
                appState.sottotipo_visibility,
                appState.societa_visibility,
                appState.unita_visibility,
            ]
        )
    }

    handleVisibilityLinee() {
        appState.$linee_380_visibility.react(value => {
            let layers = ["linee-380", "linee-380 blur", "remit_380"]
            let visibility = value == false ? "none" : "visible"
            layers.map(
                layer => {
                    map.setLayoutProperty(layer, "visibility", visibility)
                },
                { skipFirst: true }
            )
        })

        appState.$linee_220_visibility.react(value => {
            let layers = ["linee-220", "linee-220 blur", "remit_220"]
            let visibility = value == false ? "none" : "visible"
            layers.map(
                layer => {
                    map.setLayoutProperty(layer, "visibility", visibility)
                },
                { skipFirst: true }
            )
        })
    }

    handleRefreshRemitLinee() {
        appState.$remit_380.react(
            value => {
                map.getSource("remit_380").setData(value)
            },
            { skipFirst: true }
        )

        appState.$remit_220.react(
            value => {
                map.getSource("remit_220").setData(value)
            },
            { skipFirst: true }
        )
    }

    handleRefreshRemitCentrali() {
        appState.$remit_centrali.react(
            value => {
                // value && map.getSource("remit_centrali") && map.getSource("remit_centrali").setData(value)
                map.getSource("remit_centrali").setData(value)
            },
            { skipFirst: true }
        )
    }

    handleSelectLine() {
        appState.$selectLine.react(
            feature => {
                let coordinates = feature.geometry.coordinates

                flyTo()
                showPopUp()

                function flyTo() {
                    let p1 = coordinates[0]
                    let p2 = coordinates[coordinates.length - 1]
                    let sw = []
                    let ne = []
                    if (p1[0] < p2[0]) {
                        sw[0] = p1[0]
                        ne[0] = p2[0]
                    } else {
                        sw[0] = p2[0]
                        ne[0] = p1[0]
                    }
                    if (p1[1] < p2[1]) {
                        sw[1] = p1[1]
                        ne[1] = p2[1]
                    } else {
                        sw[1] = p2[1]
                        ne[1] = p1[1]
                    }
                    let bounds = new mapboxgl.LngLatBounds(sw, ne)

                    map.fitBounds(bounds, {
                        padding: 200,
                        maxZoom: 10,
                    })
                }

                function showPopUp() {
                    let midle = Math.trunc(coordinates.length / 2)
                    let popUps = document.getElementsByClassName("mapboxgl-popup")
                    if (popUps[0]) popUps[0].remove()
                    let popup = new mapboxgl.Popup()
                        .setLngLat(coordinates[midle])
                        .setHTML(
                            "<b>" +
                                feature.properties.nome +
                                "</b><br>" +
                                "<b>" +
                                "dt_upd: " +
                                "</b>" +
                                feature.properties.dt_upd +
                                "<br>" +
                                "<b>" +
                                "start_dt: " +
                                "</b>" +
                                feature.properties.start_dt +
                                "<br>" +
                                "<b>" +
                                "end_dt:  " +
                                "</b>" +
                                feature.properties.end_dt +
                                "<br>"
                        )
                        .addTo(map)
                }
            },
            { skipFirst: true }
        )
    }

    handleSelectCentrale() {
        appState.$selectCentrale.react(
            feature => {
                let coordinates = feature.geometry.coordinates
                map.flyTo({
                    center: coordinates,
                    zoom: 12,
                    speed: 1.7,
                    curve: 1.2,
                    easing(t) {
                        return t
                    },
                })
            },
            { skipFirst: true }
        )
    }

    initMap() {
        mapboxgl.accessToken = this._accessToken

        map = new mapboxgl.Map({
            container: "mapid",
            style: "mapbox://styles/browserino/cj60wfdfe228u2rmmns6i5bjr?optimize=true",
            center: [11.88, 42.18],
            zoom: 5.7,
            maxZoom: 13,
            minZoom: 5.5,
        })
        // map.addControl(new mapboxgl.FullscreenControl());
    }

    initRemit() {
        if (!map.getLayer("remit_380")) {
            this.addLayerRemitLinee("380")
        }
        if (!map.getLayer("remit_220")) {
            this.addLayerRemitLinee("220")
        }
        if (!map.getLayer("remit_centrali")) {
            this.addLayerRemitCentrali()
        }
    }

    loop(fn) {
        ;(function animLoop() {
            fn()
            setTimeout(function() {
                requestAnimationFrame(animLoop)
            }, 1000 / 10)
        })()
    }

    enableLineAnimation(layerId) {
        var step = 0
        let dashArraySeq = [[0, 4, 3], [1, 4, 2], [2, 4, 1], [3, 4, 0], [0, 1, 3, 3], [0, 2, 3, 2], [0, 3, 3, 1]]

        this.loop(() => {
            step = (step + 1) % dashArraySeq.length
            map.setPaintProperty(layerId, "line-dasharray", dashArraySeq[step])
        })
    }

    addLayerRemitLinee(volt) {
        if (volt == "380") {
            var remitId = "remit_380"
            var color = "#FFFF00"
            var remitData = appState.$remit_380.get()
        } else {
            var remitId = "remit_220"
            var color = "#FFFF00"
            var remitData = appState.$remit_220.get()
        }

        map.addLayer({
            id: remitId,
            type: "line",
            source: {
                type: "geojson",
                data: remitData,
            },
            paint: {
                "line-color": color,
                "line-opacity": 1,
                "line-width": {
                    base: 1,
                    stops: [[6, 2], [14, 3]],
                },
                "line-dasharray": [0, 4, 3],
            },
        })
        this.enableLineAnimation(remitId)
    }

    addLayerRemitCentrali() {
        var remitId = "remit_centrali"
        var remitData = appState.$remit_centrali.get()
        var framesPerSecond = 10
        var initialOpacity = 1
        var opacity = initialOpacity
        var initialRadius = 3
        var radius = initialRadius
        var direction = 0
        var color = {
            base: 1,
            type: "categorical",
            property: "tipo",
            stops: [
                ["TERMICO", "#E0090C"],
                ["EOLICO", "#5907AB"],
                ["IDRICO", "#04A1A1"],
                ["AUTOPRODUTTORE", "#9E577C"],
                ["SOLARE", "#9E4F0B"],
                ["POMPAGGIO", "#0E952F"],
                ["GEOTERMICO", "#7E4F21"],
            ],
        }

        map.addSource("remit_centrali", {
            type: "geojson",
            data: remitData,
        })

        map.addLayer({
            id: "remit_centrali",
            type: "circle",
            source: "remit_centrali",
            paint: {
                "circle-color": color,
                "circle-stroke-color": "#FFFF00",
                "circle-stroke-opacity": initialOpacity,
                "circle-stroke-width": 2,
                "circle-opacity": 1,
                "circle-radius": {
                    base: 1,
                    type: "exponential",
                    property: "pmax",
                    stops: [
                        [{ value: 0, zoom: 4 }, 4],
                        [
                            {
                                value: 0,
                                zoom: 6,
                            },
                            6,
                        ],
                        [
                            {
                                value: 3000,
                                zoom: 6,
                            },
                            24,
                        ],
                        [
                            {
                                value: 0,
                                zoom: 8,
                            },
                            11,
                        ],
                        [
                            {
                                value: 3000,
                                zoom: 8,
                            },
                            33,
                        ],
                        [
                            {
                                value: 0,
                                zoom: 13,
                            },
                            13,
                        ],
                        [
                            {
                                value: 3000,
                                zoom: 13,
                            },
                            36,
                        ],
                    ],
                    default: 10,
                },
            },
        })

        function animateMarker(timestamp) {
            setTimeout(function() {
                requestAnimationFrame(animateMarker)
                var zoom = map.getZoom()
                var maxRadius = -0.06 * Math.pow(zoom, 2) + 1.14 * zoom - 2.68
                radius += (maxRadius - radius) / framesPerSecond

                // if (opacity <= 0.9 && direction == 0) {
                //     opacity += 1.15 / framesPerSecond
                // } else if (opacity >= 0.4) {
                //     direction = 1
                //     opacity -= 0.7 / framesPerSecond
                // } else {
                //     direction = 0
                //     opacity = initialOpacity
                //     radius = 0
                // }

                radius += (maxRadius - radius) / framesPerSecond
                opacity -= 0.9 / framesPerSecond

                if (opacity < 0.2) {
                    opacity = 0.2
                }

                map.setPaintProperty("remit_centrali", "circle-stroke-width", radius)
                map.setPaintProperty("remit_centrali", "circle-stroke-opacity", opacity)

                if (opacity == 0.2) {
                    radius = initialRadius
                    opacity = initialOpacity
                }

                // if (opacity <= 0.2) {
                //     // radius = initialRadius
                //     opacity = initialOpacity
                // }
            }, 1000 / framesPerSecond)
        }

        // Start the animation.
        animateMarker(0)
    }

    initHoverEffect() {
        this.addHoverEffect("380")
        this.addHoverEffect("220")
    }

    addHoverEffect(volt) {
        if (volt == "380") {
            var idLayer = "hover_380"
            var sourceName = "tileset_transmission_380"
            var urlTileSet = "mapbox://browserino.cjcb6ahdv0daq2xnwfxp96z9t-142vr"
            var sourceLayer = "transmission_380"
            var layer = "linee-380"
        } else {
            var idLayer = "hover_220"
            var sourceName = "tileset_transmission_220"
            var urlTileSet = "mapbox://browserino.cjcfb90n41pub2xp6liaz7quj-69qt1"
            var sourceLayer = "transmission_220"
            var layer = "linee-220"
        }

        map.addSource(sourceName, {
            type: "vector",
            url: urlTileSet,
        })

        map.addLayer({
            id: idLayer,
            type: "line",
            source: sourceName,
            layout: {},
            interactive: true,
            "source-layer": sourceLayer,
            maxzoom: 13,
            paint: {
                "line-color": "#88CC55",
                "line-width": 3,
            },
            filter: ["==", "nome", ""],
        })

        map.on("mouseover", layer, function(e) {
            // if (!map.loaded()) return
            map.getCanvas().style.cursor = "pointer"
            var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]]
            var features = map.queryRenderedFeatures(bbox, {
                layers: [layer],
            })

            if (!features.length) return

            if (features.length) {
                map.getCanvas().style.cursor = "pointer"
                let feature = features[0]
                map.setFilter(idLayer, ["==", "nome", feature.properties.nome])
            } else {
                map.setFilter(idLayer, ["==", "nome", ""])
            }
        })

        map.on("mouseout", layer, function() {
            map.getCanvas().style.cursor = ""
            map.setFilter(idLayer, ["==", "nome", ""])
        })
    }

    initShowPopUp() {
        this.addShowPopUp("380")
        this.addShowPopUp("220")
        this.addShowPopUp("centrale")
    }

    addShowPopUp(volt) {
        if (volt == "380") {
            var layer = "linee-380"
        } else if (volt == "220") {
            var layer = "linee-220"
        } else {
            var layer = "centrali"
        }
        // console.log(layer)

        map.on("click", function(e) {
            var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]]

            var features = map.queryRenderedFeatures(bbox, {
                layers: [layer], // replace this with the name of the layer
            })

            if (!features.length) {
                return
            }

            var feature = features[0]
            let content = setContentPopUp(feature)

            var popup = new mapboxgl.Popup({
                offset: [0, -5],
            })
                .setLngLat(e.lngLat)
                .setHTML(content)
                .addTo(map)
        })

        function setContentPopUp(feature) {
            // prettier-ignore
            /* eslint-disable no-alert, no-console */
            if (feature.layer.id == "centrali") {
                var content = "<b>" + feature.properties.etso + "</b><br>" +
                              "<b>" + "Company: " + "</b>" + feature.properties.company + "<br>" +
                              "<b>" + "Impianto: " + "</b>" + feature.properties.impianto + "<br>" +
                              "<b>" + "Operatore: " + "</b>" + feature.properties.operatore + "<br>" +
                              "<b>" + "Propietario: " + "</b>" + feature.properties.proprietario + "<br>" +
                              "<b>" + "Localita: " + "</b>" + feature.properties.localita + "<br>" +
                              "<b>" + "Tipo: " + "</b>" + feature.properties.tipo + "<br>" +
                              "<b>" + "Msd: " + "</b>" + feature.properties.msd + "<br>" +
                              "<b>" + "Pmin: " + "</b>" + feature.properties.pmin + "<br>" +
                              "<b>" + "Pmax: " + "</b>" + feature.properties.pmax + "<br>"

            } else {
                var content = "<b>" + feature.properties.nome + "</b><br>" +
                              "<b>" + "From: " + "</b>" + feature.properties.p1 + "<br>" +
                              "<b>" + "To: " + "</b>" + feature.properties.p2 + "<br>" +
                              "<b>" + "Lunghezza: " + "</b>" + feature.properties.lunghezza + "<br>" +
                              "<b>" + "Voltage: " + "</b>" + feature.properties.voltage + "<br>"
            }

            return content
        }
        /* eslint-enable no-alert */
    }

    view({ attrs }) {
        // prettier-ignore
        return m("#mapid", attrs, m(Legend))
    }

    oncreate({ attrs, state }) {
        this.initMap()
        map.on("load", () => {
            this.initRemit()
            this.initHoverEffect()
            this.initShowPopUp()
            this.handleVisibilityLinee()
            this.handleVisibilityUnita()
            this.handleRefreshRemitLinee()
            this.handleRefreshRemitCentrali()
        })
        this.handleSelectLine()
        this.handleSelectCentrale()

        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: attrs,
                state: state,
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default MapBox
