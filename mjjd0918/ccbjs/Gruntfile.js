module.exports = function(grunt) {
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.url ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
            clean: {
                files: ['bin/*.js']
            },
            concat: {
                options: {
                    banner: '<%= banner %>',
                    stripBanners: true
                },
                all: {
                    src: [
                        "./core/CCB.js" 
						 ,"./core/Class.js" 

						 ,"./event/Event.js" 
						 ,"./event/EventDispatcher.js" 
						 ,"./event/KeyboardEvent.js" 
						 ,"./event/MouseEvent.js" 

						 ,"./display/Blend.js" 
						 ,"./display/Stage.js" 
						 ,"./display/DisplayObject.js" 
						 ,"./display/Sprite.js" 
						 ,"./display/Group.js" 
						 ,"./display/TextFile.js" 
						 ,"./data/animationXMLReader.js" 

						 ,"./tween/Tween.js" 

						 ,"./particle/Particle.js" 
						 ,"./particle/ParticleStyle.js" 
						 ,"./particle/ParticleEmitter.js" 

						 ,"./sound/Sound.js" 
						 ,"./sound/SoundsManager.js" 
                    ],
                    dest: 'min/<%= pkg.name %>.<%= pkg.version %>.js'
                }
            },
            uglify: {
                options: {
                    banner: '<%= banner %>'
                },
                all: {
                    src: '<%= concat.all.dest %>',
                    dest: 'min/<%= pkg.name %>.<%= pkg.version %>.min.js'
                }
            },
            replace: {
                dist: {
                    options: {
                        variables: {
                            'VERSION': '<%= pkg.version %>',
                            'DATE': '<%= grunt.template.today("yyyy-mm-dd") %>'
                        },
                        prefix: '@'
                    },
                    files: [
                        {
                            'src': ['min/*.js'],
                            'dest': './'
                        }
                    ]
                }
            },

            jshint: {
                gruntfile: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: 'Gruntfile.js'
                },
                src: {
                    options: {
                        jshintrc: 'src/.jshintrc'
                    },
                    src: ['./**/*.js']
                }
            }
        });

        grunt.loadNpmTasks('grunt-replace');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.registerTask('default', ['clean', 'concat', 'replace', 'uglify']);

};