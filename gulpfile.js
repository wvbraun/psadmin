"use-strict";

var gulp = require("gulp");
var connect = require("gulp-connect"); // runs local dev server
var open = require("gulp-open"); // opens url in browser
var browserify = require("browserify"); // bundles js
var reactify = require("reactify"); // Transforms react jsx to js
var source = require("vinyl-source-stream"); // Use conventional text streams w/ gulp
var concat = require("gulp-concat"); // concats files
var lint = require("gulp-eslint"); // Lint JS files

var config = {
  port: 8080,
  devBaseUrl: "http://localhost",
  paths: {
    html: "./src/*.html",
    js: "./src/**/*.js",
    images: "./src/images/*",
    css: [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/bootstrap/dist/css/bootstrap-theme.min.css",
        "node_modules/toastr/toastr.scss"
    ],
    mainJs: "./src/main.js",
    dist: "./dist"
  }
};

// start local dev server
gulp.task("connect", function() {
  connect.server({
    root: ["dist"],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task("open", ["connect"], function() {
  gulp.src("dist/index.html")
    .pipe(open({ uri: config.devBaseUrl + ":" + config.port + "/" }));
});

// Find html files and put into dist path then reload w/ connect
gulp.task("html", function() {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task("js", function() {
  browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on("error", console.error.bind(console))
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(config.paths.dist + "/scripts"))
    .pipe(connect.reload());
});

gulp.task("css", function() {
  gulp.src(config.paths.css)
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(config.paths.dist + "/css"));
});

gulp.task("lint", function() {
  return gulp.src(config.paths.js)
    .pipe(lint({config: "eslint.config.json"}))
    .pipe(lint.format());
});

gulp.task("images", function() {
  gulp.src(config.paths.images)
    .pipe(gulp.dest(config.paths.dist + "/images"))
    .pipe(connect.reload());

  gulp.src("./src/favicon.ico")
    .pipe(gulp.dest(config.paths.dist));
});

// watch files so that each time we make a change, gulp reloads browser
gulp.task("watch", function() {
    gulp.watch(config.paths.html, ["html"]);
    gulp.watch(config.paths.js, ["js", "lint"]);
});

gulp.task("default",
         ["html", "js", "css", "images", "lint", "open", "watch"]
);
