/**
 * WP Editor Boxes Addon
 * 
 * @author    David Chandra Purnama <david@shellcreeper.com>
 * @copyright Copyright (c) 2013, David Chandra Purnama
 * @link      http://my.wp-editor.com
 * @link      http://shellcreeper.com
 * @license   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

(function(){

	/**
	 * ================================================
	 * Hide Path
	 * ================================================
	 */
	function wpe_boxes_hide_path( ed, e ){
		jQuery('#' + tinyMCE.activeEditor.editorId + '_path').hide();
	};

	/**
	 * ================================================
	 * Inline Setting
	 * ================================================
	 */
	function wpe_boxes_inline_setting( ed, e ){
		/* Editor var */
		var editor_id = tinyMCE.activeEditor.editorId;
		var editor_content = jQuery( '#' + tinyMCE.activeEditor.editorId + '_ifr' ).contents();

		/* Add inline setting */
		editor_content.find( ".wpe-box" ).mousemove(function(){

			/* Add active class */
			jQuery( this ).addClass('wpe-box-active');

			/* If inline setting not exist, add it */
			if ( jQuery( this ).children('.wpe-box-remove').length <= 0 ) {
				jQuery( this ).prepend( '<div class="wpe-box-remove"></div>' );
			}
		});

		/* Remove inline setting */
		editor_content.find( ".wpe-box" ).mouseleave(function(){
			jQuery( this ).removeClass('wpe-box-active');
			jQuery( this ).children( '.wpe-box-remove' ).remove();
		});
	};


	/**
	 * ================================================
	 * Do Inline Setting
	 * ================================================
	 */
	function wpe_boxes_do_inline_setting( ed, e ){
		/* Editor var */
		var editor_id = tinyMCE.activeEditor.editorId;
		var editor_content = jQuery( '#' + tinyMCE.activeEditor.editorId + '_ifr' ).contents();

		/* Remove box */
		editor_content.find('.wpe-box-remove').unbind("click").click(function(){

			/* Add class to delete setting */
			jQuery(this).addClass( "wpe-box-setting-ready-remove" );

			/* Add class to delete the current box */
			jQuery(this).closest( '.wpe-box' ).addClass( "wpe-box-ready-remove" );

			/* Get content */
			var get_content = editor_content.find('.wpe-box-ready-remove').html();
			editor_content.find('.wpe-box-ready-remove').after( get_content );
			editor_content.find('.wpe-box-ready-remove').remove();
			editor_content.find('.wpe-box-setting-ready-remove').remove();
		});
	};

	/**
	 * ================================================
	 * Create TinyMCE Plugin for Boxes
	 * Modified from Crazy Pills Plugins
	 * http://wordpress.org/extend/plugins/crazy-pills/
	 * ================================================
	 */
	tinymce.create( 'tinymce.plugins.wpe_addon_boxes', {

		/* Load inline setting on editor click */
		init : function( ed, url ) {
			/* Add Setting OnInit and OnEvent  */
			ed.onInit.add( function( ed, e ) {
				wpe_boxes_inline_setting( ed, e );
			});
			/* Hide Path  */
			ed.onBeforeGetContent.add( function( ed, e ) {
				wpe_boxes_hide_path( ed, e );
			});
			ed.onEvent.add( function( ed, e ) {
				wpe_boxes_inline_setting( ed, e );
			});
			/* Add Setting On Click */
			ed.onMouseDown.add( function( ed, e ) {
				wpe_boxes_do_inline_setting( ed, e );
			});
		},

		/**
		 * Creates control instances based in the incomming name.
		 */
		createControl: function (n, cm) {
			switch(n) {
			case 'wpe_addon_boxes':
				var wpe_boxes_option = cm.createListBox('wpe_addon_boxes', {
					title: 'Boxes',
					onselect: function (v) {
						tinyMCE.activeEditor.focus();
						var sel_txt = tinyMCE.activeEditor.selection.getContent();
						if( '' == sel_txt ) sel_txt = "Message box contents...";
						tinyMCE.activeEditor.execCommand( 'mceInsertContent', false, '<div class="wpe-box wpe-box-' + v + '">' + "<p>" + sel_txt +  "</p>" + '</div>');
					}
				});
				wpe_boxes_option.add( 'Note Box', 'note' );
				wpe_boxes_option.add( 'Alert Box', 'alert' );
				wpe_boxes_option.add( 'Error Box', 'error' );
				wpe_boxes_option.add( 'Download Box', 'download' );
				return wpe_boxes_option;
			}
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 */
		getInfo : function() {
			return {
				longname : "WP Editor Boxes",
				author : "David Chandra Purnama",
				authorurl : 'http://shellcreeper.com',
				infourl : 'http://wp-editor.com',
				version : "0.1.0"
			};
		}
	});

	tinymce.PluginManager.add( 'wpe_addon_boxes', tinymce.plugins.wpe_addon_boxes );
})();