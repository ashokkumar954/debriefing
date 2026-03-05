/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

'use strict';

const cssmin = require('cssmin');
const child_process = require('child_process');
const crypto = require('crypto');

module.exports = function (grunt) {
    const pkgObject = grunt.file.readJSON('package.json');
    const pkgNameWithoutScope = pkgObject.name.split("/").at(-1); // @scope/my-plugin -> my-plugin

    // For CI builds override the version from the environment variable;
    // for local builds leave the version as-is so bumpup increments it cleanly.
    if (process.env.CI_RELEASE_VERSION) {
        pkgObject.version = processVersion(process.env.CI_RELEASE_VERSION);
        grunt.file.write('package.json', JSON.stringify(pkgObject, null, 2));
    }

    const outputDir = 'build';
    const BUMP_IGNORE_FILE_NAME = '.bumpignore';

    const SOURCES_FOLDER_NAME_TEMPLATE = `${pkgNameWithoutScope}-<%= pkg.version %>-sources`;
    const SOURCES_FILE_NAME_TEMPLATE = `${pkgNameWithoutScope}-<%= pkg.version %>-sources.zip`;
    const ARCHIVE_FOLDER = 'hosted';
    const ARCHIVE_FILE_NAME_TEMPLATE = `${pkgNameWithoutScope}-<%= pkg.version %>-hosted.zip`;
    const PACKAGE_FILE_NAME_TEMPLATE = `${pkgNameWithoutScope}-package.zip`;

    const CSS_IMAGES_FILES_REGEXP = /images\/([a-z_]+\.svg)/g;

    const ORIGINAL_COMMIT_HASH_REPLACE_REGEXP = /("originalCommitHash": ")(")/g;
    const ORIGINAL_FILES_CHECKSUM_REPLACE_REGEXP = /("originalFilesChecksum": ")(")/g;
    const SRC_FILES_PATTERNS = [
        './src/**',
        './grunt-tasks/**',
        './scripts/**',
        './test/**',
        './Gruntfile.js',
        './README.md',
        './LICENSE.txt',
        './oraclejetconfig.json',
        './oraclejafconfig.json',
        '!./test/reporter-config.json',
        '!./test/run-unit-tests.sh',
        '!./test/run-tests.sh'
    ];

    const gitCommitHash = getGitCommitHash();
    const isGitTreeDirty = getIsGitTreeDirty();
    const filesChecksum = getFilesChecksum();

// OJET audit
    grunt.registerTask('ojetAudit', 'Run Jet Audit', function () {
        const done = this.async();
        const ojaf = child_process.spawn('./node_modules/.bin/ojaf', [], {stdio: 'inherit'});
        ojaf.on('close', code => (code === 0 ? done() : done(false)));
    });

// OJET build (release)
    grunt.registerTask('ojetBuild', 'Run ojet build (release)', function () {
        const done = this.async();
        const ojet = child_process.spawn('ojet', ['build', '--release'], {stdio: 'inherit', shell: true});
        ojet.on('close', code => (code === 0 ? done() : done(false)));
    });

// OJET build (dev) – equivalent to oraclejet-build:dev
    grunt.registerTask('ojetBuildDev', 'Run ojet build (dev)', function () {
        const done = this.async();
        const ojet = child_process.spawn('ojet', ['build'], {stdio: 'inherit', shell: true});
        ojet.on('close', code => (code === 0 ? done() : done(false)));
    });

    grunt.initConfig({
        pkg: pkgObject,

        addCopyright: {
            main: {
                files: [
                    {
                        src: outputDir + '/' + ARCHIVE_FOLDER + '/bundle.js',
                        dest: outputDir + '/' + ARCHIVE_FOLDER + '/bundle.js'
                    },
                    {
                        src: outputDir + '/' + ARCHIVE_FOLDER + '/app.css',
                        dest: outputDir + '/' + ARCHIVE_FOLDER + '/app.css'
                    }
                ]
            }
        },

        bumpup: {options: {updateProps: {pkg: 'package.json'}}, files: ['package.json']},

        clean: [outputDir],

        processhtml: {
            dist: {
                options: {
                    data: {
                        // function is used to get version updated by bumpup task
                        getVersion: () => grunt.config.get('pkg.version'),
                        commitHash: gitCommitHash + (isGitTreeDirty ? '.DIRTY' : ''),
                        filesChecksum: filesChecksum,
                        originalCommitHash: grunt.config.get('pkg.ofscMetadata.originalCommitHash'),
                        originalFilesChecksum: grunt.config.get('pkg.ofscMetadata.originalFilesChecksum')
                    }
                },
                files: [{
                    src: [outputDir + '/' + ARCHIVE_FOLDER + '/index.html'],
                    dest: outputDir + '/' + ARCHIVE_FOLDER + '/index.html'
                }]
            }
        },

        copy: {
// libs into web/js/libs
            preact_files: {
                expand: true,
                cwd: 'node_modules/@oracle/oraclejet-preact/amd/',
                src: ['**/*.js'],
                dest: 'web/js/libs/oraclejet-preact/amd/'
            },
            ojet_debug_files: {
                expand: true,
                cwd: 'node_modules/@oracle/oraclejet/dist/js/libs/oj/debug',
                src: ['**'],
                dest: 'web/js/libs/oj/18.1.0/debug/'
            },
            ojet_core_files: {
                expand: true,
                cwd: 'node_modules/@oracle/oraclejet/dist/js/libs/oj/',
                src: [
                    'ojL10n.js',
                    'resources/**' // includes resources/nls/*.js
                ],
                dest: 'web/js/libs/oj/18.1.0/'
            },
            preact_dist_files: {
                expand: true, cwd: 'node_modules/preact/dist', src: ['*.js', '*.map'], dest: 'web/js/libs/preact/dist/'
            },
            preact_hooks_files: {
                expand: true,
                cwd: 'node_modules/preact/hooks/dist',
                src: ['*.js', '*.map'],
                dest: 'web/js/libs/preact/hooks/dist/'
            },
            preact_compat_files: {
                expand: true,
                cwd: 'node_modules/preact/compat/dist',
                src: ['*.js', '*.map'],
                dest: 'web/js/libs/preact/compat/dist/'
            },
            preact_jsx_runtime_files: {
                expand: true,
                cwd: 'node_modules/preact/jsx-runtime/dist',
                src: ['*.js', '*.map'],
                dest: 'web/js/libs/preact/jsx-runtime/dist/'
            },
            preact_debug_files: {
                expand: true,
                cwd: 'node_modules/preact/debug/dist',
                src: ['*.js', '*.map'],
                dest: 'web/js/libs/preact/debug/dist/'
            },
            preact_devtools_files: {
                expand: true,
                cwd: 'node_modules/preact/devtools/dist',
                src: ['*.js', '*.map'],
                dest: 'web/js/libs/preact/devtools/dist/'
            },
// unit test prerequisites
            knockout_debug_files: {
                expand: true,
                cwd: 'node_modules/knockout/build/output/',
                src: ['knockout-3.5.1.debug.js'],
                dest: 'web/js/libs/knockout/'
            },
            js_signals: {
                expand: true, cwd: 'node_modules/js-signals/dist/', src: ['signals.js'], dest: 'web/js/libs/js-signals/'
            },

// build artifacts to hosted
            bundle: {
                files: [
                    {src: ['web/index.html'], dest: outputDir + '/' + ARCHIVE_FOLDER + '/index.html'},
                    {src: ['web/js/bundle.js'], dest: outputDir + '/' + ARCHIVE_FOLDER + '/bundle.js'}
                ]
            },
            js: {
                src: 'web/js/bundle.js',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/bundle.js',
                options: {
                    process: (content, srcPath) =>
                        srcPath.match(/(.html|.js|.json)$/i)
                            ? content.replace(/\{\*ROOT_SERVICE_WORKER_VERSION\*\}/g, grunt.config.get('pkg.rootServiceWorkerVersion'))
                            : content
                }
            },
            service_worker: {
                src: 'web/plugin-service-worker.js',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/plugin-service-worker.js',
                options: {
                    process: (content, srcPath) => {
                        return srcPath.match(/(.html|.js|.json)$/i)
                            ? content
                                .replace(/\{\*ROOT_SERVICE_WORKER_VERSION\*\}/g, grunt.config.get('pkg.rootServiceWorkerVersion'))
                            : content;
                    }
                }
            },
            html2pdf: {
                src: 'web/js/vendor/html2pdf/html2pdf.bundle.js', // update if you move vendor scripts
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/html2pdf.bundle.js'
            },
            manifest: {src: 'web/manifest.appcache', dest: outputDir + '/' + ARCHIVE_FOLDER + '/manifest.appcache'},
            pluginManifest: {src: ['./manifest.json'], dest: outputDir + '/'},
            html: {
                src: 'web/index.html',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/index.html'
            },
            css_app: {
                src: 'web/css/app.css',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/app.css',
                options: {process: content => cssmin(content.replace(CSS_IMAGES_FILES_REGEXP, '$1'))}
            },
            css_local_fonts: {
                src: 'web/css/local-fonts.css',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/local-fonts.css'
            },
            sprite_app: {
                src: 'web/css/images/app_sprite.svg',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/app_sprite.svg'
            },
            logo: {
                src: 'web/css/images/logo.svg',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/logo.svg'
            },
            licenses: {src: ['./*LICENSE*.txt'], dest: outputDir + '/'},

            sources: {
                src: SRC_FILES_PATTERNS, dest: `${outputDir}/${SOURCES_FOLDER_NAME_TEMPLATE}/`,
                options: {
                    process: (content, srcPath) =>
                        srcPath.match(/(.html|.js|.json)$/i)
                            ? content.replace(/\{\*ROOT_SERVICE_WORKER_VERSION\*\}/g, grunt.config.get('pkg.rootServiceWorkerVersion'))
                            : content
                }
            },
            sources_package_json: {
                src: ['./package.json'], dest: `${outputDir}/${SOURCES_FOLDER_NAME_TEMPLATE}/`,
                options: {
                    process: content =>
                        content
                            .replace(ORIGINAL_COMMIT_HASH_REPLACE_REGEXP, '$1' + gitCommitHash + (isGitTreeDirty ? '.DIRTY' : '') + '$2')
                            .replace(ORIGINAL_FILES_CHECKSUM_REPLACE_REGEXP, '$1' + filesChecksum + '$2')
                }
            }
        },
        uglify: {
            bundle: {
                files: [{
                    src: outputDir + '/' + ARCHIVE_FOLDER + '/bundle.js',
                    dest: outputDir + '/' + ARCHIVE_FOLDER + '/bundle.js'
                }],
                options: {mangle: true}
            }
        },

        preact_umd: {
            expand: true,
            cwd: 'node_modules/preact/dist',
            src: ['preact.umd.js', 'jsx-runtime.js'],
            dest: 'web/js/libs/preact/dist/'
        },

        oraclejet_preact_hooks_UNSAFE_useFormVariantContext: {
            src: 'node_modules/@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext.js',
            dest: 'web/js/@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext.js'
        },

        compress: {
            main: {
                options: {archive: outputDir + '/' + ARCHIVE_FILE_NAME_TEMPLATE},
                files: [{expand: true, cwd: outputDir + '/' + ARCHIVE_FOLDER + '/', src: ['**/*'], dest: '/'}]
            },
            sources: {
                options: {archive: outputDir + '/' + SOURCES_FILE_NAME_TEMPLATE},
                files: [{
                    expand: true,
                    cwd: outputDir + '/',
                    dot: true,
                    src: [SOURCES_FOLDER_NAME_TEMPLATE + '/**'],
                    dest: '/'
                }]
            },
            package: {
                options: {archive: outputDir + '/package/' + PACKAGE_FILE_NAME_TEMPLATE},
                files: [{
                    expand: true, cwd: outputDir + '/',
                    src: [ARCHIVE_FILE_NAME_TEMPLATE,
                        SOURCES_FILE_NAME_TEMPLATE,
                        'manifest.json',
                        'LICENSE.txt',
                        'THIRD_PARTY_LICENSES.txt'],
                    dest: `/`
                }]
            }
        },

        generatePluginXml: {options: {outputDir: outputDir, archiveFile: `${outputDir}/${ARCHIVE_FILE_NAME_TEMPLATE}`}},
        generatePropertiesXml: {options: {outputDir: outputDir}}
    });

// Removed: grunt.option('platform', 'web'); and loadNpmTasks('@oracle/grunt-oraclejet');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadTasks('grunt-tasks/generate-xml');
    grunt.loadTasks('grunt-tasks/add-copyright');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('autoIncrementVersion', 'Auto increment package version (patch) on every build', () => {
        grunt.task.run('bumpup:patch');
    });

// Prepare libs needed for unit tests (copies into web/js/libs)
    grunt.registerTask('test-setup', [
        'copy:ojet_debug_files',
        'copy:ojet_core_files',
        'copy:preact_files',
        'copy:preact_dist_files',
        'copy:preact_hooks_files',
        'copy:preact_compat_files',
        'copy:preact_jsx_runtime_files',
        'copy:preact_debug_files',
        'copy:preact_devtools_files',
        'copy:knockout_debug_files',
        'copy:js_signals'
    ]);

// Match the name your script calls
    grunt.registerTask('oraclejet-build:dev', [
        'copyPreactFiles',
        'ojetBuildDev'
    ]);
    grunt.registerTask('oraclejet-build:release', [
        'copyPreactFiles',
        'ojetBuild'
    ]);

    grunt.registerTask('copyBuiltResources', [
        'copy:html',
        'copy:js',
        'copy:bundle',
        'copy:manifest',
        'copy:css_app',
        'copy:css_local_fonts',
        'copy:sprite_app',
        'copy:logo',
        'copy:html2pdf',
        'copy:service_worker'
    ]);

    grunt.registerTask('distributeHosted', () => {
        grunt.task.run('clean');
        grunt.task.run('copyBuiltResources');
        grunt.task.run('processhtml');
        grunt.task.run('addCopyright:main');
        grunt.task.run('updateManifest');
        grunt.task.run('compress:main');
        grunt.task.run('generateXml');
    });

    const distributeSourcesDescription = 'Copy source files and pack them into archive. It creates ".bumpignore" file in a copied folder and an archive';
    grunt.registerTask('distributeSources', distributeSourcesDescription, () => {
        grunt.task.run('copy:sources');
        grunt.task.run('copy:sources_package_json');
        addBumpVersionIgnore(outputDir + '/' + grunt.template.process(SOURCES_FOLDER_NAME_TEMPLATE));
        grunt.task.run('compress:sources');
    });

    grunt.registerTask('package', [
        'oraclejet-build:release',
        'distributeStandardPluginPackage'
    ]);

    grunt.registerTask('distributePackage', [
        'copy:pluginManifest',
        'copy:licenses',
        'compress:package'
    ]);

    function processVersion(envValue) {
        //2601.133.0-251120031120714
        //2601 - release version
        //.
        //133 - build version
        //.
        //0 - patch version (could be increased in fabs)
        //25 - year
        //11 - month
        //20 - day
        //03 - hour
        //11 - minute
        // 20714


        //2601.133.253240757
        //2601 - release version
        //.
        //133 - build version
        //.
        //25 - year
        //324 - day of year
        //07 - hour
        //57 - minute

        // No build part, means that it is release build (build from main branch)
        // in that case return unchanged.
        if (!envValue.includes("-")) {
            return envValue;
        }

        // Otherwise, it is determined as build from develop branch,
        // need to remove "-" sign as not supported by plugin repository
        // also increase minor version to make builds from develop branch higher than builds from main branch

        // Split version into main part and build part
        const [main, build] = envValue.split("-");

        const parts = main.split(".");
        const major = parts[0];
        const minor = parts[1];
        const patch = parts[2];

        // Increase minor by 1000
        const newMinor = Number(minor) + 1000;

        // Concatenate patch + build (removing "-")
        let newPatch;
        if (patch === '0') {
            newPatch = build;
        } else {
            newPatch = patch + build;
        }

        return `${major}.${newMinor}.${newPatch}`;
    }


    grunt.registerTask('distributePlugin', 'Build resources, make an archive and bump package version. If ".bumpignore" exists, version bump is skipped.', () => {
        const ignoreBump = isBumpVersionIgnored();
        if (!ignoreBump) grunt.task.run('autoIncrementVersion');
        grunt.task.run('distributeHosted');
        grunt.task.run('distributeSources');
    });

    grunt.registerTask('distributeStandardPluginPackage', () => {
        grunt.task.run('distributeHosted');
        grunt.task.run('distributeSources');
        grunt.task.run('distributePackage');
    });

    grunt.registerTask('copyPreactFiles', [
        'copy:preact_files',
        'copy:preact_dist_files',
        'copy:preact_hooks_files',
        'copy:preact_compat_files',
        'copy:preact_jsx_runtime_files',
        'copy:preact_debug_files',
        'copy:preact_devtools_files'
    ]);

    grunt.registerTask('build', [
        //'ojetAudit',
        'copyPreactFiles',
        'ojetBuild',
        'distributePlugin'
    ]);

    grunt.registerTask('rebuild', ['clean', 'build']);

    grunt.registerTask('default', ['build']);

    grunt.registerTask('updateManifest', 'Add to manifest service information', function () {
        const srcContent = grunt.file.read(outputDir + '/hosted/manifest.appcache');
        grunt.file.write(outputDir + '/hosted/manifest.appcache',
            srcContent + '\n' +
            '# version ' + grunt.config.get('pkg.version') + '\n' +
            '# repo-files-checksum ' + getFilesChecksum()
        );
    });

    // Verify required hosted files exist (fail fast if missing)
    grunt.registerTask('verifyHostedFiles', 'Verify hosted artifacts exist', function () {
        const files = [
            `${outputDir}/${ARCHIVE_FOLDER}/index.html`,
            `${outputDir}/${ARCHIVE_FOLDER}/bundle.js`,
            `${outputDir}/${ARCHIVE_FOLDER}/html2pdf.bundle.js`,
            `${outputDir}/${ARCHIVE_FOLDER}/manifest.appcache`
        ];
        let ok = true;
        files.forEach(f => {
            if (!grunt.file.exists(f)) {
                grunt.log.error(`Missing hosted artifact: ${f}`);
                ok = false;
            }
        });
        if (!ok) return false;
    });

// Helpers
    function addBumpVersionIgnore(targetDir) {
        if (targetDir) grunt.file.write(targetDir + '/' + BUMP_IGNORE_FILE_NAME, null);
        else grunt.file.write(BUMP_IGNORE_FILE_NAME, null);
    }
    function isBumpVersionIgnored(targetDir) {
        return targetDir ? grunt.file.exists(targetDir + '/' + BUMP_IGNORE_FILE_NAME) : grunt.file.exists(BUMP_IGNORE_FILE_NAME);
    }
    function getIsGitTreeDirty() {
        try {
            const gitOutput = child_process.execSync('git status --porcelain -uno', {timeout: 10000}).toString();
            if (!gitOutput.length) return false;
            const changedFiles = gitOutput.trim().split('\n').map(str => str.trim());
            if (!changedFiles || changedFiles.length < 1 || (changedFiles.length === 1 && changedFiles[0] === 'M package.json')) return false;
            return true;
        } catch (e) {
            return true;
        }
    }
    function getGitCommitHash() {
        try {
            const gitOutput = child_process.execSync('git rev-parse HEAD', { timeout: 10000 }).toString();
            if (!gitOutput.length) return '';
            return gitOutput.trim();
        } catch (e) {
            return '';
        }
    }
    function getFilesChecksum() {
        const filePaths = grunt.file.expand({filter: 'isFile'}, SRC_FILES_PATTERNS);
        const fileSums = filePaths.map(path => crypto.createHash('sha256').update(grunt.file.read(path, null)).digest('hex'));
        return crypto.createHash('sha256').update(fileSums.join()).digest('hex');
    }
};