(function() {
    'use strict';

    const
        log = require('npmlog'),
        lineclip = require('lineclip'),
        pointInPoly = require('point-in-polygon'),
        Bound = require('geobound-object'),
        logPrefix = 'geojson-slicer';

    let slicer = {};

    log.level = 'verbose';

    slicer.bounds2clipBounds = function(bounds) {
        // clip bounds format [xmin, ymin, xmax, ymax]
        // return [bounds[0][0], bounds[2][1], bounds[2][0], bounds[0][1]];
        return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    };

    slicer.toPointInPolyBounds = function(bounds) {
        // [ [ 11.583709716796875, 48.16150547016801 ],
        //   [ 11.5850830078125, 48.16150547016801 ],
        //   [ 11.5850830078125, 48.1605894313262 ],
        //   [ 11.583709716796875, 48.1605894313262 ] ]
        return [bounds.getNorthWest(),
            bounds.getSouthWest(),
            bounds.getSouthEast(),
            bounds.getNorthEast()];
    };

    slicer.slicePoint = function(feature, bounds, options) {
        //  "coordinates": [102.0, 0.5]
        let coord = feature.geometry.coordinates;

        if (pointInPoly(coord, slicer.toPointInPolyBounds(bounds))) {
            return feature;
        }

        return null;
    };

    slicer.sliceMultiPoint = function(feature, bounds, options) {
        return null;
    };

    slicer.sliceLineString = function(feature, bounds, options) {
        let result = lineclip.polyline(feature.geometry.coordinates, slicer.bounds2clipBounds(bounds));


        if (result.length && result[0].length) {
            // line is within bounds.
            if (options.cutFeatures) {
                feature.geometry.coordinates = result[0];
            }

            return feature;
        }

        return null;
    };

    slicer.sliceMultiLineString = function(feature, bounds, options) {
        return null;
    };

    slicer.slicePolygon = function(feature, bounds, options) {
        let result = lineclip.polygon(feature.geometry.coordinates[0], slicer.bounds2clipBounds(bounds));


        if (result.length) {
            // line is within bounds.
            if (options.cutFeatures) {
                feature.geometry.coordinates = [result];
            }

            return feature;
        }

        return null;
    };

    slicer.sliceMultiPolygon = function(feature, bounds) {
        return null;
    };


    slicer.sliceFeature = function(feature, bounds, options) {
        if (options.filter && !options.filter(feature)) {
            return null;
        }

        if (feature.type === 'Feature') {
            // available types:
            // "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon",
            if (slicer.hasOwnProperty('slice' + feature.geometry.type)) {
                return slicer['slice' + feature.geometry.type](feature, bounds, options);
            }
        }
        if (feature.type === 'FeatureCollection') {
            return slicer.slice(feature.features, bounds, options);
        }

        if (feature.type === 'GeometryCollection') {
            log.warn(logPrefix, 'plugin cannot handle features with type GeometryCollection');
        } else {
            log.warn(logPrefix, 'ignoring unknown feature type: ' + feature.type);
        }

        return null;
    };

    slicer.slice = function(features, bounds, options) {
        let result = [];

        features.forEach(function(feature) {
            let slicedFeature = slicer.sliceFeature(feature, bounds, options);

            if (slicedFeature) {
                result.push(slicedFeature);
            }
        });

        return result;
    };

    module.exports = function(feature, border, opts) {
        let bound = new Bound(border),
            options = opts,
            result;

        if (!options) {
            options = {};
        }

        if (feature.type === 'FeatureCollection') {
            return {
                type : 'FeatureCollection',
                features : slicer.slice(feature.features, bound, options)
            };
        }
        if (feature.constructor === Array) {
            return {
                type : 'FeatureCollection',
                features : slicer.slice(feature, bound, options)
            };
        }

        result = slicer.sliceFeature(feature, bound, options);

        if (!result) {
            result = {
                type : 'FeatureCollection',
                features : []
            };
        }

        return result;
    };

}());
