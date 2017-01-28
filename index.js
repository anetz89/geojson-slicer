(function() {
    'use strict';

    const
        log = require('npmlog'),
        pointInPoly = require('point-in-polygon');

    log.level = 'verbose';

    let slicer = {
            slice : slice,
            slicePoint : slicePoint,
            sliceMultiPoint : sliceMultiPoint,
            sliceLineString : sliceLineString,
            sliceMultiLineString : sliceMultiLineString,
            slicePolygon : slicePolygon,
            sliceMultiPolygon : sliceMultiPolygon
        };

    function slicePoint(feature, bounds) {
        //  "coordinates": [102.0, 0.5]
        var coord = feature.geometry.coordinates;

        if (pointInPoly(coord, bounds)) {
            return feature;
        }
        return null;
    }

    function sliceMultiPoint(feature, bounds) {
        return null;
    }

    function sliceLineString(feature, bounds) {
        return null;
    }

    function sliceMultiLineString(feature, bounds) {
        return null;
    }

    function slicePolygon(feature, bounds) {
        return null;
    }

    function sliceMultiPolygon(feature, bounds) {
        return null;
    }


    function slice(features, bounds) {
        let result = [];


        features.forEach(function(feature) {
            let slicedFeature;
            if (feature.type === 'Feature') {
                // "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon",
                if (this.hasOwnProperty('slice' + feature.geometry.type)) {
                    slicedFeature = this['slice' + feature.geometry.type](feature, bounds);
                }
                if (slicedFeature) {
                    result.push(slicedFeature);
                }
            } // else "GeometryCollection" or "FeatureCollection".
        }.bind(this));

        return result;
    }




    module.exports = slicer;
}());
