(function() {
    'use strict';

    const
        Slicer = require('./index.js'),
        expect = function(input, value) {
            if (input !== value) {
                throw new Error('Expected ' + value + ', got ' + input);
            }
        };



    console.log('OK');
}());
