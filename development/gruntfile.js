
module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var meta = {
		srcPath: '',
		jsPath: 'js/',
		buildPath: '../build/',
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

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: pkg,

		// Metadata.
		meta: meta,

		banner: pkg.banner,

	    clean: {
		    buildDir: {
				src: ['<%= meta.buildPath %>source/**/*'],
				options: {
					force: true // force cleanup outside of cwd
				}
		    }
	    },

		copy: {
			plugin: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= meta.srcPath %>plg_wi_menuitem_params/',
						dest: '<%= meta.buildPath %>source/',
						src: [
							'**/*.{js,json,css,less,svg,png,jpg,php,html,xml,ini,sql}'
						],
						rename: function(dest, src) {
							return dest + src.replace('%id%',pkg.id).replace('%name%',pkg.name);
						}
					},
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
			// staging: {
			// 	files: [
			// 		{
			// 			expand: true,
			// 			dot: true,
			// 			src: [ '**/*.*' ],
			// 			cwd: '<%= meta.buildPath %>source/<%= pkg.plugin %>/site',
			// 			dest: '<%= meta.stagePath %>components/<%= pkg.plugin %>',
			// 		}
			// 	]
			// }
		},

		compress: {
			plugin: {
				options: {
					mode: 'zip',
					archive: '<%= meta.buildPath %>plg_<%= pkg.name %>-<%= pkg.version %>.zip'
				},
				files: [{
					cwd: '<%= meta.buildPath %>source/',
					src: ['**/*'],
					expand: true
				}]
			},
		},

		watch: {
			build : {
				// don't include all dirs as this would include node_plugins too!
				// or use !**/node_plugins/** to exclude dir
				files: ['<%= meta.srcPath %>**/*'],
				tasks: ['copy:plugin']
			},
			// stage : {
			// 	// don't include all dirs as this would include node_plugins too!
			// 	// or use !**/node_plugins/** to exclude dir
			// 	files: ['<%= meta.srcPath %>plugin/**/*','<%= meta.srcPath %>plugin/**/*','<%= meta.srcPath %>js/**/*'],
			// 	tasks: ['copy:plugin' , 'concat', 'less:development', 'copy:staging']
			// }
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-copy');
	// grunt.loadNpmTasks('grunt-contrib-concat');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task
	// grunt.registerTask('default', [ 'copy' ]);
	grunt.registerTask('build', [ 'clean:buildDir' , 'copy:plugin' , 'compress:plugin' ]);
	// grunt.registerTask('stage', [ 'clean:buildDir' , 'copy:plugin' , 'copy:staging' ]);
	//grunt.registerTask('default', ['concat']);

	grunt.registerTask('default', function() {
		console.log('Choose one of the registered tasks:');
		console.log('watch:build - compile and minify');
		console.log('build  - compile and minify, create zip release files');
		// console.log('stage / watch:stage - compile and copy to stage');
	});

};
