# Shopify Builder
An opinionated builder for Shopify.

**This is currenty in alpha and not ready for production use. API will likely change**

# How to use

To use this tools you must have a special project structure.

```
+-- assets
+-- config
+-- layout
+-- locales
+-- snippets
+-- src
+-- templates
```

It's a standard shopify project structure with a ***src*** folder.
The structure of the **src** folder must be

```
+-- src
|   +-- lib
|   +-- scripts
|   +-- sections
```

Where scripts contains JS **scripts** (like React) and sections **contains** liquid. For more information look in the example folder


```bash
yarn add shopify-builder -E
```

Add this to the scripts of your package.json

```json
"build-sections": "shopify-builder build-sections"
"build-scripts": "shopify-builder build-scripts"
"watch-sections": "shopify-builder watch-sections"
"watch-scripts": "shopify-builder watch-scripts"
```

add *.iop.* to gitignore

add to theme

<script src="{{ 'cart.iop.js' | asset_url }}" ></script>
<script src="{{ 'runtime.iop.js' | asset_url }}" ></script>
<script src="{{ 'vendor.iop.js' | asset_url }}" ></script>
