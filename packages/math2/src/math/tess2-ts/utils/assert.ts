export function assert (cond: any, message?: string) {
	if (!cond) {
		throw message || "Assertion Failed!";
	}
};