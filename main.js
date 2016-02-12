#!/usr/bin/env node

var opentype = require('opentype.min');

opentype.load(process.argv[2], function (err, font) {
  if (err) {
    process.stderr.write('Font could not be loaded: ' + err);
  } else {
    convert(font);
  }
});


var convert = function(font){
    var scale = (1000 * 100) / ( (font.unitsPerEm || 2048) *72);
    var result = {};
    result.glyphs = {};

    font.glyphs.forEach(function(glyph){
        if (glyph.unicode !== undefined) {

            var token = {};
            token.ha = Math.round(glyph.advanceWidth * scale);
            token.x_min = Math.round(glyph.xMin * scale);
            token.x_max = Math.round(glyph.xMax * scale);
            token.o = ""
            glyph.path.commands.forEach(function(command,i){
                if (command.type.toLowerCase() === "c") {command.type = "b";}
                token.o += command.type.toLowerCase();
                token.o += " "
                if (command.x !== undefined && command.y !== undefined){
                    token.o += Math.round(command.x * scale);
                    token.o += " "
                    token.o += Math.round(command.y * scale);
                    token.o += " "
                }
                if (command.x1 !== undefined && command.y1 !== undefined){
                    token.o += Math.round(command.x1 * scale);
                    token.o += " "
                    token.o += Math.round(command.y1 * scale);
                    token.o += " "
                }
                if (command.x2 !== undefined && command.y2 !== undefined){
                    token.o += Math.round(command.x2 * scale);
                    token.o += " "
                    token.o += Math.round(command.y2 * scale);
                    token.o += " "
                }
            });
            result.glyphs[String.fromCharCode(glyph.unicode)] = token;
        };
    });
    result.familyName = font.familyName;
    result.ascender = Math.round(font.ascender * scale);
    result.descender = Math.round(font.descender * scale);
    result.underlinePosition = font.tables.post.underlinePosition;
    result.underlineThickness = font.tables.post.underlineThickness;
    result.boundingBox = {
        "yMin": font.tables.head.yMin,
        "xMin": font.tables.head.xMin,
        "yMax": font.tables.head.yMax,
        "xMax": font.tables.head.xMax
    };
    result.resolution = 1000;
    result.original_font_information = font.tables.name;
    if (font.styleName.toLowerCase().indexOf("bold") > -1){
        result.cssFontWeight = "bold";
    } else {
        result.cssFontWeight = "normal";
    };

    if (font.styleName.toLowerCase().indexOf("italic") > -1){
        result.cssFontStyle = "italic";
    } else {
        result.cssFontStyle = "normal";
    };

    process.stdout.write("if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace("+ JSON.stringify(result) + ");");
};
