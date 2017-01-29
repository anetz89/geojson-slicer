(function() {
    'use strict';

    const
        log = require('npmlog'),
        lineclip = require('lineclip'),
        pointInPoly = require('point-in-polygon'),
        slicer = {
            slice : slice,
            slicePoint : slicePoint,
            sliceMultiPoint : sliceMultiPoint,
            sliceLineString : sliceLineString,
            sliceMultiLineString : sliceMultiLineString,
            slicePolygon : slicePolygon,
            sliceMultiPolygon : sliceMultiPolygon
        };

    log.level = 'verbose';

    let options = {
        cutFeatures : true
    };


    function bounds2clipBounds(bounds) {
        // clip bounds format [xmin, ymin, xmax, ymax]
        // bounds format
        // [ [ 11.583709716796875, 48.16150547016801 ],
        //   [ 11.5850830078125, 48.16150547016801 ],
        //   [ 11.5850830078125, 48.1605894313262 ],
        //   [ 11.583709716796875, 48.1605894313262 ] ]
        // return [bounds[2][1], bounds[0][0], bounds[0][1], bounds[2][0]];
        return [bounds[0][0], bounds[2][1], bounds[2][0], bounds[0][1]];
    }

    function slicePoint(feature, bounds) {
        //  "coordinates": [102.0, 0.5]
        let coord = feature.geometry.coordinates;

        if (pointInPoly(coord, bounds)) {
            return feature;
        }
        return null;
    }

    function sliceMultiPoint(feature, bounds) {
        return null;
    }

    function sliceLineString(feature, bounds) {
        let result = lineclip.polyline(feature.geometry.coordinates, bounds2clipBounds(bounds));


        if (result.length && result[0].length) {
            // line is within bounds.
            if (options.cutFeatures) {
                feature.geometry.coordinates = result;
            }
            return feature;
        }
        return null;
    }

    function sliceMultiLineString(feature, bounds) {
        return null;
    }

    function slicePolygon(feature, bounds) {
        let result = lineclip.polygon(feature.geometry.coordinates[0], bounds2clipBounds(bounds));


        if (result.length) {
            // line is within bounds.
            if (options.cutFeatures) {
                feature.geometry.coordinates = result;
            }
            return feature;
        }

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


    // slicerOptions
    // cutFeatures Boolean (true)
    // Cut Features to fit within bounds. If set to false, the complete feature is added.

    module.exports = function(slicerOptions) {
        options = slicerOptions;

        return slicer;
    };
}());
