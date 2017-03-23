#!/usr/bin/env node
/**
 * Created by alo on 2/20/17.
 */
var fs = require('fs'),
    byline = require('byline');

var isaCache = {};
var fsns = {};

var relationshipsSnapshot = "[Enter RF2 Relationships Snapshot location with -r argument]";
var descriptionsSnapshot = "[Enter RF2 Descriptions Snapshot location with -r argument]";
var inputList = "[Enter input list with -i argument]";


process.argv.forEach(function (val, index, array) {
    if (val == "-r") {
        if (!process.argv[index+1]) {
            throw ("Missing release file parameter after -r");
        } else {
            relationshipsSnapshot = process.argv[index+1];
        }
    }
    if (val == "-d") {
        if (!process.argv[index+1]) {
            throw ("Missing release file parameter after -r");
        } else {
            descriptionsSnapshot = process.argv[index+1];
        }
    }
    if (val == "-i") {
        if (!process.argv[index+1]) {
            throw ("Missing input file parameter after -r");
        } else {
            inputList = process.argv[index+1];
        }
    }
});

var stream = byline(fs.createReadStream(relationshipsSnapshot, { encoding: 'utf8' }));

var count = 0;
stream.on('data', function(line) {
    count++;
    if (count%100000==0) console.log("Relationships:",count);
    var columns = line.split("\t");
    if (columns[7] == "116680003" && columns[2] == "1") {
        if (!isaCache[columns[4]]) {
            isaCache[columns[4]] = {isas : []};
        }
        isaCache[columns[4]].isas.push(columns[5]);
    }
});

stream.on('end', function() {
    console.log("Isa Cache ready");

    var stream = byline(fs.createReadStream(descriptionsSnapshot, { encoding: 'utf8' }));

    var count = 0;
    stream.on('data', function(line) {
        count++;
        if (count%100000==0) console.log("Descriptions:",count);
        var columns = line.split("\t");
        if (columns[6] == "900000000000003001" && columns[2] == "1") {
            if (!fsns[columns[4]]) {
                fsns[columns[4]] = {};
            }
            fsns[columns[4]].fsn = columns[7];
        }
    });
    var report = "ConceptId\tFSN\tAncestor ConceptId\tAncestor FSN\n";
    stream.on('end', function() {
        console.log("FSNs Cache ready");

        var stream = byline(fs.createReadStream(inputList, { encoding: 'utf8' }));

        var count = 0;
        stream.on('data', function(line) {
            count++;
            if (count%100==0) console.log("Substances:",count);
            var columns = line.split("\t");
            getAncestors(columns[0]).forEach(function(loopAncestor) {
                report+=columns[0] + "\t" + columns[1] + "\t" + loopAncestor + "\t" + fsns[loopAncestor].fsn + "\n";
            });

        });

        stream.on('end', function() {
            fs.writeFile("ancestorsForList.txt", report, function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        });
    });
});

var getAncestors = function(descendant, ancestorsList) {
    if (!ancestorsList) ancestorsList = [];
    if (isaCache[descendant]) {
        isaCache[descendant].isas.forEach(function(loopParent) {
            if (!ancestorsList.includes(loopParent)) {
                ancestorsList.push(loopParent);
            }
        });
        isaCache[descendant].isas.forEach(function(loopParent) {
            ancestorsList = getAncestors(loopParent, ancestorsList);
        });
    }
    return ancestorsList;
};

var isDescendant = function(ancestor, descendant) {
    var result = false;
    if (isaCache[descendant]) {
        if (isaCache[descendant].isas.includes(ancestor)) {
            result = true;
        } else {
            isaCache[descendant].isas.forEach(function(loopParent) {
                result = isDescendant(ancestor, loopParent);
            });
        }
    }
    return result;
};

if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
            k++;
        }
        return false;
    };
}
