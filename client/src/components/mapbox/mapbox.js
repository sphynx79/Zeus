// src/components/mapbox/mapbox.js

import "./mapbox.css"
import mapboxgl from "mapbox-gl"
import stream  from "mithril/stream"
import Legend from "components/legend/legend.js"

var map

class MapBox {

    constructor() {
        this._componentName = this.constructor.name
        this._server        = window.location.hostname
        this._accessToken   = "pk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjajIzYXRmNnQwMDBuMndwODl1MTdjdG1yIn0.FJ-S1md8BPQtSwTF4SZsMA"
    }

    handleVisibilityUnita(){
        
    
        stream.combine((termico, eolico, idrico, autoprod, solare, pompaggi, geotermico)=> {
            let filter    = ["in", "tipo"]
            let filterMap = new Map();
            filterMap.set("TERMICO", termico());
            filterMap.set("EOLICO", eolico());
            filterMap.set("IDRICO", idrico());
            filterMap.set("AUTOPRODUTTORE", autoprod());
            filterMap.set("SOLARE", solare());
            filterMap.set("POMPAGGIO", pompaggi());
            filterMap.set("GEOTERMICO", geotermico());

            filterMap.forEach((value, key) => {value && filter.push(key)}, filterMap)
            map.setFilter("centrali", filter)

         }, [appState.termico_visibility, 
             appState.eolico_visibility, 
             appState.idrico_visibility, 
             appState.autoprod_visibility, 
             appState.solare_visibility, 
             appState.pompaggi_visibility,
             appState.geotermico_visibility
         ])
        

      
        // appState.termico_visibility.map(state => {
        //     if (state) {
        //         filter.push('TERMICO');
        //     } else { 
        //         filter  = filter.filter(item => item !== "TERMICO")
        //     }
        //     map.setFilter('centrali', filter)
        // })
        //
        // appState.eolico_visibility.map(state => {
        //     if (state) {
        //         filter.push('EOLICO');
        //     } else { 
        //         filter  = filter.filter(item => item !== "EOLICO")
        //     }
        //     map.setFilter('centrali', filter)
        // })
        //
        // appState.idrico_visibility.map(state => {
        //     if (state) {
        //         filter.push('IDRICO');
        //     } else { 
        //         filter  = filter.filter(item => item !== "IDRICO")
        //     }
        //     map.setFilter('centrali', filter)
        // })
  
    

    
    }

    handleVisibilityLinee() {

        appState.remit_380_visibility.map(value => {
                let layers = ["linee-380", "linee-380 blur", "remit_380"]
                let visibility = value == false ? "none" : "visible"
                layers.map((layer) => {map.setLayoutProperty(layer, "visibility", visibility) })     
        })

        appState.remit_220_visibility.map(value => {
                let layers = ["linee-220", "linee-220 blur", "remit_220"]
                let visibility = value == false ? "none" : "visible"
                layers.map((layer) => {map.setLayoutProperty(layer, "visibility", visibility) })     
        })

    }

    handleRefreshRemit() {

        appState.remit_380.map(value => {
            value && map.getSource("remit_380") && map.getSource("remit_380").setData(value)
        })

        appState.remit_220.map(value => {
            value && map.getSource("remit_220") && map.getSource("remit_220").setData(value)
        })

    }

    handleSelectLine() {
        appState.selectLine.map(feature => {
            let coordinates = feature.geometry.coordinates

            flyTo()
            showPopUp()

            function flyTo(){
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
                let bounds = new mapboxgl.LngLatBounds(sw , ne)

                map.fitBounds(bounds, {
                    padding: 200,
                    maxZoom: 10
                })

            }

            function showPopUp(){
                let midle = Math.trunc(coordinates.length/2)
                let popUps = document.getElementsByClassName("mapboxgl-popup");
                if (popUps[0]) popUps[0].remove()
                let popup = new mapboxgl.Popup()
                    .setLngLat(coordinates[midle])
                    .setHTML("<b>" + feature.properties.nome + "</b><br>"
                        + "<b>" + "dt_upd: "+ "</b>" + feature.properties.dt_upd + "<br>"
                        + "<b>" + "start_dt: "+ "</b>" + feature.properties.start_dt + "<br>"
                        + "<b>" + "end_dt:  "+ "</b>" + feature.properties.end_dt + "<br>"
                    )
                    .addTo(map)
            }
        })
    }

    initMap(){
        mapboxgl.accessToken = this._accessToken

        map = new mapboxgl.Map({
            container: "mapid",
            style: "mapbox://styles/browserino/cj60wfdfe228u2rmmns6i5bjr?optimize=true",
            center: [11.88, 42.18],
            zoom: 5.7,
            maxZoom: 13,
            minZoom: 5
        })
        // map.addControl(new mapboxgl.FullscreenControl());
    }

    initRemit() {
        if (!map.getLayer("remit_380")) {
            this.addLayerRemit("380")
        }
        if (!map.getLayer("remit_220")) {
            this.addLayerRemit("220")
    }
    }

    loop(fn) {
        (function animLoop() {
            fn()
            setTimeout(function() {
                requestAnimationFrame(animLoop);
                // Drawing code goes here
            }, 1000 / 10);

        })();
    }

    enableLineAnimation(layerId) {
        var step = 0;
        let dashArraySeq = [
            [0, 4, 3],
            [1, 4, 2],
            [2, 4, 1],
            [3, 4, 0],
            [0, 1, 3, 3],
            [0, 2, 3, 2],
            [0, 3, 3, 1]
        ];

        this.loop( () => {
            step = (step + 1) % dashArraySeq.length;
            map.setPaintProperty(layerId, "line-dasharray", dashArraySeq[step]);
        })
    }

    addLayerRemit(volt) {
        if (volt == "380") {
            var remitId   = "remit_380"
            var color     = "#FFFF00"
            var remitData = appState.remit_380()
        } else {
            var remitId   = "remit_220"
            var color     = "#FFFF00"
            var remitData = appState.remit_220()
        }

        map.addLayer( {
            "id": remitId,
            "type": "line",
            "source": {
                type: "geojson",
                data: remitData
            },
            "paint": {
                "line-color": color,
                "line-opacity": 1,
                "line-width": {
                    base: 1,
                    stops: [[6, 2],  [14, 3]]
                },
                "line-dasharray": [0, 4, 3],
            },
        })
        this.enableLineAnimation(remitId)

    }

    initHoverEffect() {
        this.addHoverEffect("380")
        this.addHoverEffect("220")
    }

    addHoverEffect(volt) {
        if (volt == "380") {
            var idLayer     = "hover_380"
            var sourceName  = "tileset_transmission_380"
            var urlTileSet  = "mapbox://browserino.cjcb6ahdv0daq2xnwfxp96z9t-142vr"
            var sourceLayer = "transmission_380"
            var layer       = "linee-380"
        } else {
            var idLayer     = "hover_220"
            var sourceName  = "tileset_transmission_220"
            var urlTileSet  = "mapbox://browserino.cjcfb90n41pub2xp6liaz7quj-69qt1"
            var sourceLayer = "transmission_220"
            var layer       = "linee-220"
        }

        map.addSource(sourceName, {
            "type": "vector",
            "url":  urlTileSet,
        })

        map.addLayer({
            "id": idLayer,
            "type": "line",
            "source": sourceName,
            "layout": {},
            "interactive": true,
            "source-layer": sourceLayer,
            "maxzoom": 13,
            "paint": {
                "line-color": "#88CC55",
                "line-width": 3
            },
            "filter": ["==", "nome", ""]
        })

        map.on("mouseover", layer, function (e) {
            // if (!map.loaded()) return
            map.getCanvas().style.cursor = "pointer"
            var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]]
            var features = map.queryRenderedFeatures(bbox, {layers: [layer]})

            if (!features.length) return

            if (features.length) {
                map.getCanvas().style.cursor = "pointer"
                let feature = features[0]
                map.setFilter(idLayer,["==", "nome", feature.properties.nome])
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
    }

    addShowPopUp(volt) {
        if (volt == "380") {
            var layer = "linee-380"
        } else {
            var layer = "linee-220"
        }

        map.on("click", function(e) {
            var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];

            var features = map.queryRenderedFeatures(bbox, {
                layers: [layer] // replace this with the name of the layer
            });

            if (!features.length) {
                return;
            }

            var feature = features[0];

            var popup = new mapboxgl.Popup({ offset: [0, -5] })
                .setLngLat(e.lngLat)
                .setHTML("<b>" + feature.properties.nome + "</b><br>"
                    + "<b>" + "From: "+ "</b>" + feature.properties.p1 + "<br>"
                    + "<b>" + "To: "+ "</b>" + feature.properties.p2 + "<br>"
                    + "<b>" + "Lunghezza: "+ "</b>" + feature.properties.lunghezza + "<br>"
                    + "<b>" + "Voltage: "+ "</b>" + feature.properties.voltage + "<br>" )
                .addTo(map);
        })

    }

    view({attrs,state}) {
        return m("#mapid", attrs, m(Legend))
    }

    oncreate({attrs, state}) {
        this.initMap()
        map.on("load", () => {
            this.initRemit()
            this.initHoverEffect()
            this.initShowPopUp()
            this.handleVisibilityLinee()
            this.handleVisibilityLinee()
            this.handleVisibilityUnita()
            // map.setFilter('centrali', ['in', 'tipo', 'IDRICO', 'TERMICO'])
            // console.log(map.getLayoutProperty("linee-380 blur", 'visibility'))
        })
        this.handleRefreshRemit()
        this.handleSelectLine()

        if (process.env.NODE_ENV !== "production") {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

}

export default MapBox



