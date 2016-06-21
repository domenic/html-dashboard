"use strict";
const gulp = require("gulp");
const gulpStylus = require("gulp-stylus");
const gulpConcat = require("gulp-concat");
const vinylSourceStream = require("vinyl-source-stream");
const browserify = require("browserify");
const rimraf = require("rimraf");

const OUTPUT = "www/";

const FRONTEND = "frontend";
const FRONTEND_WATCH = FRONTEND + "/**/*.{js,jsx}";
const FRONTEND_ENTRY = FRONTEND + "/main.jsx";
const FRONTEND_OUTPUT = "bundle.js";

const SW = "service-worker";
const SW_WATCH = SW + "/**/*.js";
const SW_ENTRY = SW + "/service-worker.js";
const SW_OUTPUT = "service-worker-bundle.js";

const STYLUS = FRONTEND + "/**/*.styl";
const STYLUS_WATCH = STYLUS;
const STYLUS_OUTPUT = "styles.css";

gulp.task("stylus", () =>
  gulp.src(STYLUS)
    .pipe(gulpStylus())
    .pipe(gulpConcat(STYLUS_OUTPUT))
    .pipe(gulp.dest(OUTPUT))
);

gulp.task("frontend", () =>
  browserify({
    entries: FRONTEND_ENTRY,
    debug: true
  })
  .transform("babelify", { presets: ["react"] })
  .bundle()
  .pipe(vinylSourceStream(FRONTEND_OUTPUT))
  .pipe(gulp.dest(OUTPUT))
);

gulp.task("service worker", () =>
  browserify({
    entries: SW_ENTRY,
    debug: true
  })
  .bundle()
  .pipe(vinylSourceStream(SW_OUTPUT))
  .pipe(gulp.dest(OUTPUT))
);

gulp.task("build", ["frontend", "service worker", "stylus"]);

gulp.task("watch", ["build"], () => {
  gulp.watch(FRONTEND_WATCH, ["frontend"]);
  gulp.watch(SW_WATCH, ["service worker"]);
  gulp.watch(STYLUS_WATCH, ["stylus"]);
});

gulp.task("clean", () => {
  rimraf.sync(OUTPUT + FRONTEND_OUTPUT);
  rimraf.sync(OUTPUT + SW_OUTPUT);
});
