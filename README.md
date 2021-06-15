# Shopify Builder

An opinionated builder for Shopify.

**This is currenty in alpha and not ready for production use. API will likely change**

# How to use

To use this tools you must have a predefined project structure.
(Pay attention to the _src_ folder)

```
+-- assets
+-- config
+-- layout
+-- locales
+-- snippets
+-- src
+-- templates
```

It's a standard shopify project structure with a **_src_** folder.
The structure of the **src** folder must be

```
+-- src
|   +-- lib
|   +-- scripts
|   |   +-- packages
|   |   |   +-- [package-name]
|   |   |   | 	index.(js|ts)
|   +-- sections
```

Where scripts contains JS **scripts** (like React) and sections **contains** liquid. For more information look in the example folder

```bash
yarn add @inkofpixel/shopify-builder -D
```

Add this to the scripts of your package.json

```json
"dev": "shopify-builder watch",
"watch-scripts": "shopify-builder watch scripts",
"watch-sections": "shopify-builder watch sections",
"build-scripts": "shopify-builder build scripts",
"build-sections": "shopify-builder build sections"
```

add

```.gitignore
 *.iop.*
```

to .gitignore

add to theme

```js
<script src="{{ '[package-name].iop.js' | asset_url }}" ></script>
<script src="{{ 'runtime.iop.js' | asset_url }}" ></script>
<script src="{{ 'vendor.iop.js' | asset_url }}" ></script>
```
