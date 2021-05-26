// @ts-check
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const emoji = require("node-emoji");

const styleSheetExtensionRegExp = /s?css$/;

module.exports = function loader(content) {
	const callback = this.async();

	const resolveRequest = (context, request) => {
		return new Promise((resolve, reject) => {
			this.resolve(context, request, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	};

	const parseLiquidModule = (liquidModule) =>
		parseDependencies(liquidModule)
			.then(loadLiquidDependenciesSource)
			.then(embedLiquidDeps);

	const parseDependencies = (liquidModule) => {
		return Promise.all(getModules(liquidModule)).then((modules) =>
			removeNonLiquidDepsFromSource({
				...liquidModule,
				dependencies: new Map(
					modules.map((module) => [module.resolvedRequest, module])
				),
			})
		);
	};

	const getModules = (liquidModule) =>
		findRequires(liquidModule).map(getModule(liquidModule.context));

	const findRequires = (liquidModule) => {
		const requireRegExp = /@require\("([^"]+)"\)/g;
		let match = requireRegExp.exec(liquidModule.source);
		const requests = [];
		while (match) {
			const request = match[1];
			requests.push(request);
			match = requireRegExp.exec(liquidModule.source);
		}
		return requests;
	};

	const getModule = (context) => (request) => {
		return resolveRequest(context, request)
			.then((resolvedRequest) => ({
				context: path.dirname(resolvedRequest),
				filename: path.basename(request),
				request,
				resolvedRequest,
				extension: path.extname(request).slice(1),
			}))
			.catch((error) => {
				throw error;
			});
	};

	const removeNonLiquidDepsFromSource = (liquidModule) => {
		const newModule = { ...liquidModule };
		liquidModule.dependencies.forEach((module) => {
			if (module.extension !== "liquid") {
				newModule.source = removeRequestFromSource(
					module.request,
					newModule.source
				);
			}
		});
		return newModule;
	};

	const removeRequestFromSource = (request, source) => {
		const r = new RegExp(`\n?@require\\("${escapeRegExp(request)}"\\)\n?`, "g");
		return source.replace(r, "");
	};

	const loadLiquidDependenciesSource = (liquidModule) =>
		new Promise((resolve, reject) => {
			const depsIterator = liquidModule.dependencies.values();
			let { value, done } = depsIterator.next();
			const loadPromises = [];
			while (!done) {
				if (value.extension === "liquid") {
					loadPromises.push(loadLiquidModule(value));
				} else if (styleSheetExtensionRegExp.test(value.extension)) {
					loadPromises.push(loadStyleModule(value));
				} else {
					loadPromises.push(loadModule(value));
				}
				({ value, done } = depsIterator.next());
			}

			Promise.all(loadPromises)
				.then((requests) => {
					const newDeps = new Map(liquidModule.dependencies);
					requests.forEach((request) =>
						newDeps.set(request.resolvedRequest, request)
					);
					resolve({
						...liquidModule,
						dependencies: newDeps,
					});
				})
				.catch(reject);
		});

	const loadStyleModule = (module) =>
		new Promise((resolve, reject) => {
			this.loadModule(module.resolvedRequest, (error, source) => {
				console.log("source", source);

				if (error) {
					reject(error);
				} else {
					resolve({
						...module,
						source: source.replace(/export default "/g, "").slice(0, -2),
					});
				}
			});
		});

	const loadModule = (module) =>
		new Promise((resolve, reject) => {
			const self = { ...this, context: module.context };
			debugger;
			self.loadModule(module.resolvedRequest, (error, source) => {
				if (error) {
					reject(error);
				} else {
					resolve({ ...module, source });
				}
			});
		});

	const loadLiquidModule = (module) =>
		new Promise((resolve, reject) => {
			fs.readFile(module.resolvedRequest, "utf8", (error, data) => {
				if (error) {
					reject(error);
				} else {
					parseLiquidModule({ ...module, source: data })
						.then(resolve)
						.catch(reject);
				}
			});
		});

	const loadRawModule = (module) =>
		new Promise((resolve, reject) => {
			fs.readFile(module.resolvedRequest, "utf8", (error, data) => {
				if (error) {
					reject(error);
				} else {
					resolve({ ...module, source: data });
				}
			});
		});

	const embedLiquidDeps = (liquidModule) => {
		let moduleWithDeps = liquidModule;

		liquidModule.dependencies.forEach((submodule, resolvedRequest) => {
			if (submodule.extension === "liquid") {
				this.addDependency(resolvedRequest);
				moduleWithDeps = replaceLiquidModuleWithSource(
					moduleWithDeps,
					submodule
				);
				moduleWithDeps.dependencies.delete(resolvedRequest);
				moduleWithDeps.dependencies = new Map([
					...moduleWithDeps.dependencies,
					...submodule.dependencies,
				]);
			}
		});
		return moduleWithDeps;
	};

	const replaceLiquidModuleWithSource = (module, submodule) => {
		const r = new RegExp(
			`@require\\("${escapeRegExp(submodule.request)}"\\)\n?`,
			"g"
		);
		const newSource = module.source.replace(r, submodule.source);
		return { ...module, source: newSource };
	};

	const escapeRegExp = (str) =>
		/* eslint-disable */
		str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
	/* eslint-enable */

	const attachSchema = (liquidModule) => {
		const schemaPath = path.resolve(liquidModule.context, "schema.json");
		return loadRawModule({
			resolvedRequest: schemaPath,
			filename: path.basename(schemaPath),
		}).then((schemaModule) => ({
			...liquidModule,
			schema: schemaModule.source,
		}));
	};

	const getSectionSource = (liquidModule) => `
  	{% stylesheet %}
  	${getCSSource(liquidModule)}
  	{% endstylesheet %}

  	{% schema %}
  	${liquidModule.schema}
  	{% endschema %}

  	${liquidModule.source}
  `;

	const getJSource = (liquidModule) => {
		const sources = [];
		liquidModule.dependencies.forEach((module) => {
			if (module.extension === "ts" || module.extension === "js") {
				sources.push(module.source);
			}
		});
		return sources.join("");
	};

	const getCSSource = (liquidModule) => {
		const sources = [];
		liquidModule.dependencies.forEach((module) => {
			if (styleSheetExtensionRegExp.test(module.extension)) {
				sources.push(module.source);
			}
		});
		return sources.join("");
	};

	parseLiquidModule({
		source: content,
		context: this.context,
		filename: path.basename(this.request),
		request: this.request,
	})
		.then(attachSchema)
		.then((module) => {
			const sectionName = path.basename(path.dirname(module.request));

			const sectionSource = getSectionSource(module);
			const kB = sectionSource.length / 1024;
			const emitTime = new Date();

			this.emitFile(`${sectionName}.liquid`, sectionSource);
			callback(null, getJSource(module));
		})
		.catch((error) => {
			console.log(chalk`\n{bgRed  ERROR } {red ${error.message}}`);
			callback(error);
		});
};
