broccoli-manifest
=================

HTML5 cache-manifest compilation for broccoli

A nice introduction on the subject: http://www.html5rocks.com/en/tutorials/appcache/beginner/

Usage
-----

`npm install --save broccoli-manifest`

Use `broccoli-manifest` as your last filter in the `Brocfile.js` like this

```JavaScript
var writeManifest = require('broccoli-manifest');

...

var completeTree = mergeTrees([appJs, appCss, publicFiles]);

module.exports = mergeTrees([completeTree, writeManifest(completeTree)]);
```

Options
-------

You can pass some options as the second argument to `writeManifest`:

```JavaScript

writeManifest(completeTree, {
	appcacheFile: '/manifest.appcache', // Name of the generated appcache file - default value shown
	fallback: ['assets/is-online.json assets/offline.json'] // Lines to add to the FALLBACK section of the generated manifest
});
```

Ember-cli
---------

For a current `ember-cli` project, edit your `Brocfile.js` like this

```JavaScript
var mergeTrees = require('broccoli-merge-trees');
var writeManifest = require('broccoli-manifest');

...
  all app.import statements go here
...

// Write a html5 manifest.appcache file
var completeTree = app.toTree();
module.exports = mergeTrees([completeTree, writeManifest(completeTree)]);
```

In case you do not have `mergeTrees`, just run `npm install --save broccoli-merge-trees`

Upgrade your index.html
-----------------------

Add `manifest="manifest.appcache"` to your `<html>` tag. The extra `<script>` tag
adds an eventlistener which automatically refreshes your page after a cache update.

Another approach is using this gist https://gist.github.com/ef4/82f37eb5dae4e56467b6
which loads all files stated in the manifest file.

```HTML
<!DOCTYPE html>
<html manifest="manifest.appcache">
<head>
  <script type='text/javascript'>window.addEventListener('load',function(e){window.applicationCache.addEventListener('updateready',function(e){if (window.applicationCache.status==window.applicationCache.UPDATEREADY){window.applicationCache.swapCache();window.location.reload();}},false);},false);</script>

  ...
```
