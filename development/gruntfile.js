
module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var meta = {
		srcPath: '',
		jsPath: 'js/',
		deployPath: '../release/',
		stagePath: '../staging/'
	};
	pkg.banner = '/*! \n ' +
	' * @package    <%= name %>\n' +
	' * @version    <%= version %>\n' +
	' * @date       <%= grunt.template.today("yyyy-mm-dd") %>\n' +
	' * @author     <%= author %>\n' +
	' * @copyright  Copyright (c) <%= grunt.template.today("yyyy") %> <%= copyright %>\n' +
	' */\n';

	pkg.banner = grunt.template.process(pkg.banner, {data: pkg});

	pkg.phpbanner = pkg.banner + "\n defined('_JEXEC') or die; \n";

	var files = pkg.jsFiles.main;
	pkg.jsFiles.main = [];
	for(var i=0; i<files.length; i++) {
		if(files[i]!='$appfiles') {
			pkg.jsFiles.main.push(files[i]);
		} else { // model view widget
			var tmp;
			[
				'uiapp/templates','uiapp/components','uiapp/model','uiapp/view','uiapp/widget',
				'custom/templates','custom/components','custom/model','custom/view','custom/widget'
			].forEach(function(name) {
				tmp = grunt.file.expand(meta.jsPath+name+'/*.js');
				pkg.jsFiles.main = pkg.jsFiles.main.concat( tmp );
			});
		}
	}
	// console.log(pkg.jsFiles.main);
	// var fileVars = pkg;

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: pkg,

		// Metadata.
		meta: meta,

		banner: pkg.banner,

	    clean: {
		    deployDir: {
				src: ['<%= meta.deployPath %>source/**/*'],
				options: {
					force: true // force cleanup outside of cwd
				}
		    }
	    },

		copy: {
			component: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= meta.srcPath %>component/',
						dest: '<%= meta.deployPath %>source/<%= pkg.component %>/',
						src: [
							'**/*.{js,json,css,less,svg,png,jpg,php,html,xml}'
						],
						rename: function(dest, src) {
							return dest + src.replace('%id%',pkg.id).replace('%name%',pkg.name);
						}
					},
					{
						expand: true,
						dot: true,
						cwd: '<%= meta.srcPath %>plugin/',
						dest: '<%= meta.deployPath %>source/<%= pkg.plugin %>/',
						src: [
							'**/*.{js,json,css,less,svg,png,jpg,php,html,xml}'
						],
						rename: function(dest, src) {
							return dest + src.replace('%id%',pkg.id).replace('%name%',pkg.name);
						}
					}
				],
				options: {
					process: function(content,srcPath) {
						if(grunt.file.match('**/*.{js,json,css,less,html,php,xml}', srcPath)) {
							return grunt.template.process(content, {data: pkg});
						} else {
							return content;
						}
					},
					noProcess: ['**/*.{png,gif,jpg,ico,psd}'] // processing would corrupt image files.
				}
			},
			// @TODO not working right now
			staging: {
				files: [
					{
						expand: true,
						dot: true,
						src: [ '**/*.*' ],
						cwd: '<%= meta.deployPath %>source/<%= pkg.plugin %>',
						dest: '<%= meta.stagePath %>plugins/content/<%= pkg.id %>',
					},
					{
						expand: true,
						dot: true,
						src: [ '**/*.*' ],
						cwd: '<%= meta.deployPath %>source/<%= pkg.component %>/admin',
						dest: '<%= meta.stagePath %>administrator/components/<%= pkg.component %>',
					},
					{
						expand: true,
						dot: true,
						src: [ '**/*.*' ],
						cwd: '<%= meta.deployPath %>source/<%= pkg.component %>/site',
						dest: '<%= meta.stagePath %>components/<%= pkg.component %>',
					}
				]
			}
		},

		concat: {
			options: {
				stripBanners: true,
				process: {data:pkg},
				// process: function(content,srcPath) {
				// 	grunt.log.write('process contents of '+srcPath);
				// 	return grunt.template.process(content, {data: pkg});
				// }
			},
			ylib: {
				src: pkg.jsFiles.ylib,
				dest: '<%= meta.deployPath %>source/<%= pkg.component %>/site/js/ylib.js'
			},
			js: {
				src: pkg.jsFiles.main,
				dest: '<%= meta.deployPath %>source/<%= pkg.component %>/site/js/<%= pkg.id %>.js'
			}
		},

		less: {
			development: {
				files: {
					'<%= meta.deployPath %>source/<%= pkg.component %>/site/css/<%= pkg.id %>.css': '<%= meta.deployPath %>source/<%= pkg.component %>/site/css/<%= pkg.id %>.less'
				}
			},
		},

		uglify : {
			js: {
				options: {
					banner: pkg.banner,
					beautify: false,
					preserveComments: 'some',
					mangle: false,
					compress: {
						global_defs: {
							"DEBUG": false
						},
						drop_debugger : false
					}
				},
				files: {
					'<%= meta.deployPath %>source/<%= pkg.component %>/site/js/<%= pkg.id %>.min.js' : [ '<%= meta.deployPath %>source/<%= pkg.component %>/site/js/<%= pkg.id %>.js' ],
					'<%= meta.deployPath %>source/<%= pkg.component %>/site/js/ylib.min.js' : [ '<%= meta.deployPath %>source/<%= pkg.component %>/site/js/ylib.js' ]
				}
			}
		},

		compress: {
			component: {
				options: {
					mode: 'zip',
					archive: '<%= meta.deployPath %><%= pkg.component %>-<%= pkg.version %>.zip'
				},
				files: [{
					cwd: '<%= meta.deployPath %>source/<%= pkg.component %>/',
					src: ['**/*'],
					// dest: '/',
					expand: true
				}]
			},
			plugin: {
				options: {
					mode: 'zip',
					archive: '<%= meta.deployPath %><%= pkg.plugin %>-<%= pkg.version %>.zip'
				},
				files: [{
					cwd: '<%= meta.deployPath %>source/<%= pkg.plugin %>/',
					src: ['**/*'],
					// dest: '/',
					expand: true
				}]
			},
		},

		watch: {
			deploy : {
				// don't include all dirs as this would include node_modules too!
				// or use !**/node_modules/** to exclude dir
				files: ['<%= meta.srcPath %>component/**/*','<%= meta.srcPath %>plugin/**/*','<%= meta.srcPath %>js/**/*'],
				tasks: ['copy:component' , 'concat', 'less:development']
			},
			stage : {
				// don't include all dirs as this would include node_modules too!
				// or use !**/node_modules/** to exclude dir
				files: ['<%= meta.srcPath %>component/**/*','<%= meta.srcPath %>plugin/**/*','<%= meta.srcPath %>js/**/*'],
				tasks: ['copy:component' , 'concat', 'less:development', 'copy:staging']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task
	// grunt.registerTask('default', [ 'copy' ]);
	grunt.registerTask('deploy', [ 'clean:deployDir' , 'copy:component' , 'concat', 'less:development', 'uglify:js' ]);
	grunt.registerTask('release', [ 'clean:deployDir' , 'copy:component' , 'concat', 'less:development', 'uglify:js', 'compress:component', 'compress:plugin' ]);
	grunt.registerTask('stage', [ 'clean:deployDir' , 'copy:component' , 'concat', 'less:development', 'copy:staging' ]);
	//grunt.registerTask('default', ['concat']);

	grunt.registerTask('default', function() {
		console.log('Choose one of the registered tasks:');
		console.log('deploy / watch:deploy - compile and minify');
		console.log('release - compile and minify, create zip release files');
		console.log('stage / watch:stage - compile and copy to stage');
	});

};
