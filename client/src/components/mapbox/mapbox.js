// src/components/mapbox/mapbox.js

import "./mapbox.css";
import mapboxgl from 'mapbox-gl';

var map

class MapBox {

    constructor() {
        this._componentName = this.constructor.name
        this._server        = window.location.hostname
        this._accessToken   = 'pk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjajIzYXRmNnQwMDBuMndwODl1MTdjdG1yIn0.FJ-S1md8BPQtSwTF4SZsMA'
    }

    oninit({state}) {
        state._loadRemit()
    }

    view({attrs,state}) {
        return m('#mapid', attrs)
    }

    oncreate({attrs, state}) {
        this.initMap()
        map.on('load', () => {
            this.addRemitToMap((() => {
                // var features = map.queryRenderedFeatures({layers:['remit']})
                var features = map.queryRenderedFeatures({layers:['linee-380']})
                console.log(features)

            })()
            )
            this.addHoverEffect()
            console.log(map.getStyle().layers)
            var features = map.queryRenderedFeatures({layers:['remit']})
            console.log(features)
        })

        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }

    initMap(){
        mapboxgl.accessToken = this._accessToken

        map = new mapboxgl.Map({
            container: 'mapid',
            style: 'mapbox://styles/browserino/cj60wfdfe228u2rmmns6i5bjr',
            center: [11.88, 42.18],
            zoom: 7,
            maxZoom: 13,
            minZoom: 5
        })
    }

    addHoverEffect(){

        map.addSource('line380', {
            "type": "vector",
            "url": "mapbox://browserino.cj9l3jgn21kwg33s2edl2pe0o-171r0"
        })

        map.addLayer({
            "id": "hover",
            "type": "line",
            "source": "line380",
            "layout": {},
            'interactive': true,
            "source-layer": "transmission_380",
            "paint": {
                "line-color": "#88CC55",
                "line-width": 3
            },
            "filter": ["==", "id", ""]
        })

        map.on('mouseover', 'linee-380',function (e) {
            if (!map.loaded()) return
            map.getCanvas().style.cursor = ''
            var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]]
            var features = map.queryRenderedFeatures(bbox, {layers: ['linee-380']})

            if (!features.length) return

            if (features.length) {
                map.getCanvas().style.cursor = 'pointer'
                var feature = features[0]
                map.setFilter('hover',['==','id',features[0].properties.id])
            } else {
                map.setFilter("hover", ["==", "id", ""])
            }
        })

        map.on("mouseout", 'linee-380', function() {
            map.setFilter("hover", ["==", "id", ""])
        })
    }

    addRemitToMap() {
        map.addLayer({
            "id": "remit",
            "type": "line",
            "source": {
                type: 'geojson',
                data: appState.remit
            },
            "paint": {
                "line-color": "#FF0000",
                "line-opacity": 1,
                'line-width': {
                    base: 1,
                    stops: [[6, 1], [9, 2], [14, 4]]
                },
            },
        })
        // debugger
        // var features = map.queryRenderedFeatures({layers:['remit']});
        // console.log(features)
    }

    _loadRemit() {
        appState.dispatch("loadRemit")
    }

}

export default MapBox
