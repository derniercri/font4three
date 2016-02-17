[![NPM](https://nodei.co/npm/font4three.png?compact=true)](https://npmjs.org/package/font4three)

# font4three
Command line tool to use Font with ThreeJS

## Installation
```
npm install -g font4three
```

## Usage

```
f43 [font file source]
```

The output by default is stdout, use with command line redirection `>` to export in file

```
f43 [font file source] > [font file destination].js
```

Now you are ready to use your font with THREE.TextGeometry

See more informations about [TextGeometry](http://threejs.org/docs/#Reference/Extras.Geometries/TextGeometry)

## Credit

We just wrap the facetype.js code in a command line tool for more conveniance at use. All credit return to [gero3/facetype](https://github.com/gero3/facetype.js) for his great work
