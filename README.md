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

Where scripts contains JS **scripts** (like React) and sections **contains** liquid.

```bash
yarn add @inkofpixel/shopify-builder -D
```

Add this to the scripts of your package.json

```json
"dev": "shopify-builder watch",
"watch-scripts": "shopify-builder watch scripts",
"watch-sections": "shopify-builder watch sections",
"build": "shopify-builder build",
"build-scripts": "shopify-builder build scripts",
"build-sections": "shopify-builder build sections"
```

add this to .gitignore

```.gitignore
# Ignore iop files
*.iop.*
```

add to theme if there is something in "scripts" folder

```html
<script src="{{ '[package-name].iop.js' | asset_url }}"></script>
<script src="{{ 'runtime.iop.js' | asset_url }}"></script>
<script src="{{ 'vendor.iop.js' | asset_url }}"></script>
```
