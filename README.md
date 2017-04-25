# geojson-slicer
slice a given set of geojson features to fit within a certain bounding box

## Installation
Use standard npm installation

```shell
npm install --save geojson-slicer
```

## Usage
require the geojson-slicer function and call it with the required parameters

```js
const slicer = require('geojson-slicer'),
    geoJsonObject = {
        type : 'FeatureCollection',
        features : [ ... ]
    },
    bounds = [0, 1, 2, 3];  // compare geobound-object inputs

let group = slicer(geoJsonObject, bounds, {
        cutFeatures : false
    }),
    cut = slicer(geoJsonObject, bounds);

// group and cut describe GeoJSON-FeatureCollections with the same features.
// group contains the original features provided in geoJsonObject
// cut contains the features cutted at the borders of the given bounds

```

### Parameters
The slicer method accepts three parameters:

- Feature(s) *(required)*
- bounds *(requried)*
- Options *(optional)*

#### Feature(s) *(required)*
This property describes the input of features. There are three different ways to pass features:

##### Pass a list of features
```js
[{
    type : 'Feature',
    geometry : {
        type : 'Point',
        coordinates : [ ... ]
    },
    properties : { ... }
},{
    type : 'Feature',
    geometry : {
        type : 'LineString',
        coordinates : [ ... ]
    },
    properties : { ... }
}]
```

##### Pass a FeatureCollection
```js
{
    type : 'FeatureCollection',
    features : [{
        type : 'Feature',
        geometry : {
            type : 'Point',
            coordinates : [ ... ]
        },
        properties : { ... }
    },{
        type : 'Feature',
        geometry : {
            type : 'LineString',
            coordinates : [ ... ]
        },
        properties : { ... }
    }]
}
```

##### Pass a single feature
```js
{
    type : 'Feature',
    geometry : {
        type : 'LineString',
        coordinates : [ ... ]
    },
    properties : { ... }
}
```

Please note that the last way is only useful if you want to cut the privided feature by the borders.

#### bounds *(requried)*
Bounds the features should be sliced with. The format of the bounds need to be a valid input for a WGS84 [bound object](https://www.npmjs.com/package/geobound-object) constructor call.

#### Options *(optional)*
You can pass additional options to control the behavior.

##### cutFeatures (default: true)
Cut Features to fit within bounds. If set to false, the complete feature is added instead of a part of the feature that lies within the given bounds.

##### filter (default: null)
Optional filter function to prevent a feature to be added to the sliced boundary.
Input parameter of the passed function is the feature. 

A boolean return value is expected:

- true: apply a boundary check and add the feature if it lies within the boundary, 
- false: do not add this feature to the given bound, although it may lie within the boundary.

Passing no function applies the boundary check for each feature (same behavior than passing a function that returns true all the time).


## Future Work
The following improvements are planned:
- add tests
- support Polygon with wholes
- support MultiPoint, MultiLineString, MultiPolygon and GeometryCollection

## Contribute
Feel free to add issues or pull requests. I'm glad for every kind of feedback!
