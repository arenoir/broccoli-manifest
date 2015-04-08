var fs = require("fs");
var path = require('path');
var brocWriter = require("broccoli-writer");
var helpers = require("broccoli-kitchen-sink-helpers");

var BroccoliManifest = function BroccoliManifest(inTree, options) {
  if (!(this instanceof BroccoliManifest)) {
    return new BroccoliManifest(inTree, options);
  }
  this.inTree = inTree;
  options = options || {};
  this.appcacheFile = options.appcacheFile || "/manifest.appcache";
  this.includePaths = options.includePaths || [];
  this.prependPath  = options.prependPath;

  this.network = options.network || ['*'];
  this.fallback = options.fallback || [];
};

BroccoliManifest.prototype = Object.create(brocWriter.prototype);
BroccoliManifest.prototype.constructor = BroccoliManifest;

BroccoliManifest.prototype.write = function(readTree, destDir) {
  var appcacheFile = this.appcacheFile;
  var includePaths = this.includePaths;
  var network = this.network;
  var fallback = this.fallback;
  return readTree(this.inTree).then(function (srcDir) {
    var lines = ["CACHE MANIFEST", "# created " + (new Date()).toISOString(), "", "CACHE:"];

    getFilesRecursively(srcDir, [ "**/*" ]).forEach(function (file) {
      var srcFile = path.join(srcDir, file);
      var stat = fs.lstatSync(srcFile);

      if (!stat.isFile() && !stat.isSymbolicLink()) {
        return;
      }

      if (this.prependPath) {
        file = this.prependPath + file;
      }

      lines.push(file);
    });

    includePaths.forEach(function (file) {
      lines.push(file);
    });

    lines.push("","NETWORK:");

    network.forEach(function (line) {
      lines.push(line);
    });

    if (fallback.length) {
      lines.push("", "FALLBACK:");
      lines.push.apply(lines, fallback);
    }

    fs.writeFileSync(path.join(destDir, appcacheFile), lines.join("\n"));
  });
};

BroccoliManifest.prototype.addExternalFile = function(file) {
  this.externalFiles.push(file);
}

function getFilesRecursively(dir, globPatterns) {
  return helpers.multiGlob(globPatterns, { cwd: dir });
}

module.exports = BroccoliManifest;
