export const load = async ({ url }) => {
	return {
		currentRoute: url.pathname,
	};
}