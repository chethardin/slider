// import classnames from 'classnames';
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;
const { withSelect } = wp.data;
const { __ } = wp.i18n;

const { 
	InnerBlocks, 
	BlockControls, 
	InspectorControls, 
	__experimentalBlockAlignmentMatrixToolbar, 
	MediaUpload, 
	MediaUploadCheck,
	withColors, 
	getColorClassName,
	PanelColorSettings
} = wp.blockEditor;

const { compose } = wp.compose;

const { 
	PanelBody, 
	Button,
	ResponsiveWrapper,
	RangeControl
} = wp.components;

const BlockEdit = (props) => {
	const { 
		attributes, 
		setAttributes,
	 } = props;

	const {
		overlay, 
		alignment,
		dimRatio
	} = attributes;

	const ALLOWED_BLOCKS = [ 'core/buttons', 'core/paragraph', 'core/heading' ];

	const TEMPLATE = [[ 'core/heading', 
		
	]];

	const removeMedia = () => {
		props.setAttributes({
			mediaId: 0,
			mediaUrl: ''
		});
	}
 
 	const onSelectMedia = (media) => {
		props.setAttributes({
			mediaId: media.id,
			mediaUrl: media.url
		});
	}
 
	const blockStyle = {
		backgroundImage: attributes.mediaUrl != '' ? 'url("' + attributes.mediaUrl + '")' : 'none'
	};

	const overlayDim = {
		backgroundColor: overlay != '' ? overlay : '',
		opacity: dimRatio != 0 ? dimRatio / 100 : 0
	}

	return (
		<Fragment>
			<BlockControls>	
				<__experimentalBlockAlignmentMatrixToolbar
					label={ __( 'Change content position' ) }
					value={ alignment }
					onChange={ ( nextPosition ) =>
						setAttributes( { alignment: nextPosition } )
					}
				/>		 
			</BlockControls>
			<InspectorControls>
				<PanelColorSettings 
					title={__('Overlay settings')}
					colorSettings={[
						{
							value: overlay,
							onChange: ( colorValue ) => setAttributes( { overlay: colorValue } ),
							label: __('Color')
						}
					]}
				>
					<RangeControl
						label={ __( 'Opacity' ) }
						value={ dimRatio }
						onChange={ ( newDimRation ) =>
							setAttributes( {
								dimRatio: newDimRation,
							} )
						}
						min={ 0 }
						max={ 100 }
					/>
				</PanelColorSettings>
				<PanelBody
					title={__('Select slide image', 'kungfu')}
					initialOpen={ true }
				>
					<div className="editor-post-featured-image">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectMedia}
								value={attributes.mediaId}
								allowedTypes={ ['image'] }
								render={({open}) => (
									<Button 
										className={attributes.mediaId == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
										onClick={open}
									>
										{attributes.mediaId == 0 && __('Choose an image', 'kungfu')}
										{props.media != undefined && 
						            			<ResponsiveWrapper
									    		naturalWidth={ props.media.media_details.width }
											naturalHeight={ props.media.media_details.height }
									    	>
									    		<img src={props.media.source_url} />
									    	</ResponsiveWrapper>
						            		}
									</Button>
								)}
							/>
						</MediaUploadCheck>
						{attributes.mediaId != 0 && 
							<MediaUploadCheck>
								<MediaUpload
									title={__('Replace image', 'kungfu')}
									value={attributes.mediaId}
									onSelect={onSelectMedia}
									allowedTypes={['image']}
									render={({open}) => (
										<Button onClick={open} isDefault>{__('Replace image', 'kungfu')}</Button>
									)}
								/>
							</MediaUploadCheck>
						}
						{attributes.mediaId != 0 && 
							<MediaUploadCheck>
								<Button onClick={removeMedia} isLink isDestructive>{__('Remove image', 'kungfu')}</Button>
							</MediaUploadCheck>
						}
					</div>
				</PanelBody>
			</InspectorControls>
			<div className={'kungfu-slide'} style={blockStyle}>
				<div className={'kungfu-overlay'} style={overlayDim}></div>
				<InnerBlocks 
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					className={'kungfu-slide-content'}
				/>
			</div>
		</Fragment>
	);
};

const ImageControls = withSelect((select, props) => {
	return { media: props.attributes.mediaId ? select('core').getMedia(props.attributes.mediaId) : undefined };
})(BlockEdit);

const CombinedComponent = compose(withColors('overlay'))(ImageControls);

registerBlockType('kungfu/slide', {
	title: 'Slide',
	icon: 'format-image',
	category: 'common',
	keywords: [
		__( 'Slide', 'kungfu' ), 
		__( 'Slides', 'kungfu' ), 
	],
	attributes: {
		alignment: {
			type: 'string',
		},
		mediaId: {
			type: 'number',
			default: 0
		},
		mediaUrl: {
			type: 'string',
			default: ''
		},
		overlay: {
			type: 'string',
			default: ''
		},
		dimRatio: {
			type: 'number',
			default: 20,
		}
	}, 
	edit: (props) => {
		return <CombinedComponent {...props} />;
	},
	save: (props) => {
		const { attributes } = props;

		const img = attributes.mediaUrl != '' ? attributes.mediaUrl : '';

		const align = attributes.alignment != undefined ? 'uk-position-' + attributes.alignment.replace(/\s+/g, '-') : 'uk-position-center';

        function OverlayElement() {
            if( attributes.overlay)  {
				const overlayDimFront = {
					backgroundColor: attributes.overlay != '' ? attributes.overlay : '',
					opacity: attributes.dimRatio != 0 ? attributes.dimRatio / 100 : 0
				}
                return <>
                    <div className="kungfu-overlay" style={overlayDimFront}></div>
                </>;
            } else {
                return null;
            }
        };

		return (
			<li>
				<div className="uk-panel">
					<div className="uk-cover-container">
						<img uk-img="" data-src={img} alt="" uk-cover="" />
					</div>
					<OverlayElement />
					<div className={`kungfu-slide-content ${align}`}>
						<InnerBlocks.Content />
					</div>
				</div>
			</li>
		);
	}
});