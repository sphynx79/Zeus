// src/components/mapbox/mapbox.js

import "./mapbox.css"
import mapboxgl from 'mapbox-gl'
import stream  from 'mithril/stream'

var map

class MapBox {

    constructor() {
        this._componentName = this.constructor.name
        this._server        = window.location.hostname
        this._accessToken   = 'pk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjajIzYXRmNnQwMDBuMndwODl1MTdjdG1yIn0.FJ-S1md8BPQtSwTF4SZsMA'
    }

    handleRefreshRemit() {
        this.remit = appState.remit.map(value => map.getSource('remit') && map.getSource('remit').setData(value))
    }

    handleSelectLine() {
        appState.selectLine.map(feature => {
            let coordinates = feature.geometry.coordinates
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

            var bounds = new mapboxgl.LngLatBounds(sw , ne)

            map.fitBounds(bounds, {
                padding: 200,
                maxZoom: 10
            })

            let midle = Math.trunc(coordinates.length/2)
            let popUps = document.getElementsByClassName('mapboxgl-popup');
            if (popUps[0]) popUps[0].remove();
            let popup = new mapboxgl.Popup()
                .setLngLat(coordinates[midle])
                .setHTML('<b>' + feature.properties.nome + '</b><br>'
                    + '<b>' + 'dt_upd: '+ '</b>' + feature.properties.dt_upd + '<br>'
                    + '<b>' + 'start_dt: '+ '</b>' + feature.properties.start_dt + '<br>'
                    + '<b>' + 'end_dt:  '+ '</b>' + feature.properties.end_dt + '<br>'
                )
                .addTo(map);




        }
        )
    }

    initMap(){
        mapboxgl.accessToken = this._accessToken

        map = new mapboxgl.Map({
            container: 'mapid',
            style: 'mapbox://styles/browserino/cj60wfdfe228u2rmmns6i5bjr',
            center: [11.88, 42.18],
            zoom: 6,
            maxZoom: 13,
            minZoom: 5
        })
    }

    initRemit() {
        map.addLayer({
            "id": "remit",
            "type": "line",
            "source": {
                type: 'geojson',
                data: appState.remit()
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
            map.getCanvas().style.cursor = 'pointer'
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
            map.getCanvas().style.cursor = ''
            map.setFilter("hover", ["==", "id", ""])
        })

    }

    view({attrs,state}) {
        return m('#mapid', attrs)
    }

    oncreate({attrs, state}) {
        this.initMap()
        map.on('load', () => {
            this.initRemit()
            this.addHoverEffect()
        })
        this.handleRefreshRemit()
        this.handleSelectLine()

        if (process.env.NODE_ENV !== 'production') {
            let logStateAttrs = {
                attrs: attrs,
                state: state
            }
            console.log(`Component: ${this._componentName}`, logStateAttrs)
        }
    }
}

export default MapBox


