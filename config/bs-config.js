module.exports = {
	open: false,
	logLevel: "silent",
	port: 3000,
	files: [
		"./src/**/*.{html,htm,css,js}"
	],
	server: {
		baseDir: ["./", "./src"],
		directory: true
	}
}
