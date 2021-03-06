const _ = require('lodash');
const KarmaServer = require('karma').Server;
const gulp = require('gulp');
const shell = require('gulp-shell');
const gutil = require('gulp-util');
const path = require('path');

const cmdArgs = require('minimist')(process.argv.slice(2));

gulp.task('eslint', () => {
  const eslint = require('gulp-eslint');
  const friendlyFormatter = require('eslint-friendly-formatter');

  return gulp.src([
    '*.js',
    'client/*.js',
    'client/src/**/*.js',
    'server/**/*.js',
    'e2e/**/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format(friendlyFormatter))
    .pipe(eslint.failAfterError());
});

gulp.task('htmlhint', () => {
  const htmlhint = require('gulp-htmlhint');

  gulp.src('client/src/**/*.html')
    .pipe(htmlhint({
      'doctype-first': false,
      'tag-self-close': true
    }))
    .pipe(htmlhint.reporter('htmlhint-stylish'));
});

gulp.task('lint', ['eslint', 'htmlhint']);

function buildKarmaServer(config) {
  config = _.extend({}, {
    configFile: path.join(__dirname, 'client', 'karma.config.js')
  }, config);

  if (cmdArgs.browsers) {
    _.extend(config, {
      browsers: cmdArgs.browsers.split(',')
    });
  }

  return new KarmaServer(config);
}

gulp.task('test', (done) => {
  const server = buildKarmaServer({ singleRun: true });

  server.on('run_complete', (browsers, results) => {
    const { failed } = results;

    if (failed > 0) {
      const message = failed > 1 ? 'Tests' : 'Test';

      done(new gutil.PluginError('karma', {
        message: [failed, message, 'failed'].join(' ')
      }));
    } else {
      done();
    }
  });

  server.start();
});

gulp.task('tdd', () => {
  const server = buildKarmaServer({ singleRun: false });
  server.start();
});

gulp.task('server:test', shell.task(
  'node_modules/.bin/istanbul cover --dir artifacts/server/coverage ' +
  'node_modules/.bin/_mocha -- --reporter dot server/**/*.spec.js'
));

gulp.task('default', (done) => {
  const runSequence = require('run-sequence');

  runSequence(
    'lint',
    'server:test',
    'test',
    done
  );
});
