const gulp = require('gulp')
const shell = require('gulp-shell')
const eslint = require('gulp-eslint')
const tslint = require('gulp-tslint')
const tslintLib = require('tslint')

const tslintProgram = tslintLib.Linter.createProgram('./tsconfig.json')

gulp.task('lint', [
  'lint:ts',
  'lint:dts',
  'lint:js:built',
  'lint:js:node',
  'lint:js:tests',
  'example-repos:build'
])

gulp.task('lint:ts', function() {
  return gulp.src([
    'src/**/*.ts',
    'plugins/**/*.ts'
  ])
    .pipe(
      tslint({ // will use tslint.json
        formatter: 'verbose',
        program: tslintProgram // for type-checking rules
      })
    )
    .pipe(tslint.report())
})

// runs the definitions file through the typescript compiler with strict settings
gulp.task('lint:dts', [ 'ts-types' ], shell.task(
  './node_modules/typescript/bin/tsc dist/fullcalendar.d.ts --noImplicitAny --strictNullChecks'
))

gulp.task('lint:js:built', [ 'webpack' ], function() {
  return gulp.src([
    'dist/*.js',
    '!dist/*.min.js'
  ])
    .pipe(
      eslint({ // only checks that globals are properly accessed
        parserOptions: { 'ecmaVersion': 3 }, // for IE9
        envs: [ 'browser', 'commonjs', 'amd' ],
        rules: { 'no-undef': 2 }
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('lint:js:node', function() {
  return gulp.src([
    '*.js', // config files in root
    'tasks/**/*.js'
  ])
    .pipe(
      eslint({
        configFile: 'eslint.json',
        envs: [ 'node' ]
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('lint:js:tests', function() {
  return gulp.src([
    'tests/automated/**/*.js'
  ])
    .pipe(
      eslint({
        configFile: 'eslint.json',
        envs: [ 'browser', 'jasmine', 'jquery' ],
        globals: [
          'moment',
          'karmaConfig',
          'pushOptions',
          'describeOptions',
          'describeTimezones',
          'describeValues',
          'pit',
          'affix',
          'getCurrentOptions',
          'initCalendar',
          'currentCalendar',
          'spyOnMethod',
          'spyOnCalendarCallback',
          'spyCall',
          'oneCall'
        ]
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})
