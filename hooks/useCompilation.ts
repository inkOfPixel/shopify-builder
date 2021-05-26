import React from "react";
import webpack, { Configuration, Stats } from "webpack";

export type CompilerResult = {
	errors: string[];
	warnings: string[];
};

function generateStats(stat: Stats): CompilerResult {
	const result: CompilerResult = { errors: [], warnings: [] };
	const { errors, warnings } = stat.toJson({
		errorDetails: true,
		errorsCount: true,
		warnings: true,
	});
	console.log("errors", errors);
	console.log("warnings", warnings);

	if (errors.length > 0) {
		result.errors.push(...errors.map((error) => error.message));
	}

	if (warnings.length > 0) {
		result.warnings.push(...warnings.map((warning) => warning.message));
	}

	return result;
}

function useCompilation(
	webpackConfig: Configuration,
	watch: boolean = false,
	type: "scripts" | "sections"
): {
	percentage: number;
	currentStep: string;
	errors: string[];
	warnings: string[];
} {
	const [percentage, setPercentage] = React.useState(0);
	const [currentStep, setCurrentStep] = React.useState<string>("");
	const [errors, setErrors] = React.useState<string[]>([]);
	const [warnings, setWarnings] = React.useState<string[]>([]);

	React.useEffect(() => {
		const compiler = webpack(webpackConfig);
		new webpack.ProgressPlugin((percentage, msg) => {
			setPercentage(Math.floor(percentage * 100));
			setCurrentStep(msg);
		}).apply(compiler);

		if (watch) {
			const watching = compiler.watch({}, (error: Error, stats: Stats) => {
				if (error) {
					const reason = error?.toString();
					console.error(reason);
					throw error;
				}
				if (stats.hasErrors() || stats.hasWarnings()) {
					const errorsAndWarnings = generateStats(stats);
					setErrors(errorsAndWarnings.errors);
					setWarnings(errorsAndWarnings.warnings);
				}
			});
			return () => {
				watching.close((closeErr) => {
					if (closeErr) {
						console.error(closeErr);
					}
					console.log(`${type} watch ended. Bye 👋👋👋`);
				});
			};
		} else {
			compiler.run((error, stats) => {
				if (error) {
					const reason = error?.toString();
					console.error(reason);
					throw error;
				}
				if (stats.hasErrors() || stats.hasWarnings()) {
					const errorsAndWarnings = generateStats(stats);
					setErrors(errorsAndWarnings.errors);
					setWarnings(errorsAndWarnings.warnings);
				}
				compiler.close((closeErr) => {
					if (closeErr) {
						console.error(closeErr);
					}
					console.log(`${type} build ended. Bye 👋👋👋`);
				});
			});
		}
	}, []);

	return { percentage, currentStep, errors, warnings };
}

export default useCompilation;
