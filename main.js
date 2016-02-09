var opentype = require('opentype.js');

opentype.load('./fonts/Roboto-Black.ttf', function (err, font) {
  if (err) {
    console.log('Font could not be loaded: ' + err)
  } else {
    console.log(font.supported)
    convert(font);
  }
});

var convert = function(font) {
    var index;
    var scale = (1000 * 100) / ( (font.unitsPerEm || 2048) *72);
    var result = {};
    result.glyphs = {};

    console.log(typeof font.glyphs)
    console.log(font.glyphs.length)

    for (index in font.glyphs) {
      console.log("\n\n----------------------------------------------------\n\n\n")
      console.log(index, font.glyphs[index])
    }

    var glyph;
    Object.keys(font.glyphs.glyphs).forEach(function(key) {
        glyph = font.glyphs.glyphs[key];

        console.log(glyph.unicode);

        if (glyph.unicode !== undefined) {
            var token = {};
            token.ha = Math.round(glyph.advanceWidth * scale);
            token.x_min = Math.round(glyph.xMin * scale);
            token.x_max = Math.round(glyph.xMax * scale);
            token.o = ""
            // if (reverseTypeface.checked) {glyph.path.commands = reverseCommands(glyph.path.commands);}
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

    if (font.styleName && font.styleName.toLowerCase().indexOf("bold") > -1){
        result.cssFontWeight = "bold";
    } else {
        result.cssFontWeight = "normal";
    };

    if (font.styleName && font.styleName.toLowerCase().indexOf("italic") > -1){
        result.cssFontStyle = "italic";
    } else {
        result.cssFontStyle = "normal";
    };

    console.log("if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace("+ JSON.stringify(result) + ");");
};

var reverseCommands = function(commands){

    var paths = [];
    var path;

    commands.forEach(function(c){
        if (c.type.toLowerCase() === "m"){
            path = [c];
            paths.push(path);
        } else if (c.type.toLowerCase() !== "z") {
            path.push(c);
        }
    });

    var reversed = [];
    paths.forEach(function(p){
        var result = {"type":"m" , "x" : p[p.length-1].x, "y": p[p.length-1].y};
        reversed.push(result);

        for(var i = p.length - 1;i > 0; i-- ){
            var command = p[i];
            result = {"type":command.type};
            if (command.x2 !== undefined && command.y2 !== undefined){
                result.x1 = command.x2;
                result.y1 = command.y2;
                result.x2 = command.x1;
                result.y2 = command.y1;
            } else if (command.x1 !== undefined && command.y1 !== undefined){
                result.x1 = command.x1;
                result.y1 = command.y1;
            }
            result.x =  p[i-1].x;
            result.y =  p[i-1].y;
            reversed.push(result);
        }

    });

    return reversed;

};
