<?php

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', function() 
{ 
	
	wp_register_script( 
		'kungfu-slider-editor-scripts', 
		plugins_url( 'dist/slider.build.js', __FILE__ ), 
		array( 
			'wp-i18n', 
			'wp-element', 
			'wp-editor', 
			'wp-components'
		), 
		filemtime( plugin_dir_path( __FILE__ ) . 'dist/slider.build.js' ), 
		true 
	);

	wp_register_style(
		'kungfu-slider-editor-styles',
		plugins_url( 'assets/editor.css', __FILE__ ),
		array( 'wp-edit-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'assets/editor.css' )
	);

	wp_register_style( 
		'kungfu-slider-styles', 
		plugins_url( 'assets/styles.css', __FILE__ ),
		array(), 
		filemtime( plugin_dir_path( __FILE__ ) . 'assets/styles.css' )	
	);

	register_block_type( 'kungfu/slider', array(
		'editor_script' => 'kungfu-slider-editor-scripts',
		'editor_style' => 'kungfu-slider-editor-styles',
		'style' => 'kungfu-slider-styles',
	) );

});

add_action( 'enqueue_block_editor_assets', function() 
{

	wp_enqueue_script('kungfu-slider');
	wp_enqueue_style('kungfu-slider-editor-styles');
	
});


// add_action('wp_enqueue_scripts', function()
// {

// 	wp_enqueue_style( 'kungfu-slider-styles' );
	
// });
