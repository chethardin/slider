const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks;
const { Component } = wp.element;
const { 
    InnerBlocks,  
    InspectorControls, 
    BlockControls, 
    AlignmentToolbar 
} = wp.blockEditor;
const { 
    ToggleControl, 
    PanelBody, 
    PanelRow, 
    CheckboxControl, 
    SelectControl, 
    ColorPicker, 
    Toolbar, 
    IconButton,
    Disabled,
    TextControl
} = wp.components;

const { select } = wp.data;

class SliderEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editMode: true
        }
    }

    getInspectorControls = () => {
        const { attributes, setAttributes } = this.props;
 
        return (
            <InspectorControls>
                <PanelBody
                    title="Navigation Options"
                    initialOpen={true}
                >
                    <PanelRow>
                        <ToggleControl
                            label="Use arrows?"
                            checked={attributes.arrows}
                            onChange={(newArrowsVal) => setAttributes({ arrows: newArrowsVal })}
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label="Use bullets?"
                            checked={attributes.bullets}
                            onChange={(newBulletsVal) => setAttributes({ bullets: newBulletsVal })}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        );
    }
 
    getBlockControls = () => {
        const { attributes, setAttributes } = this.props;
        return (
            <BlockControls>
                <AlignmentToolbar
                    value={attributes.textAlignment}
                    onChange={(newalign) => setAttributes({ textAlignment: newalign })}
                />
                <Toolbar>
                    <IconButton
                        label={ this.state.editMode ? "Edit" : "Preview" }
                        icon={ this.state.editMode ? "edit" : "visibility" }
                        onClick={() => this.setState({ editMode: !this.state.editMode })}
                    />
                </Toolbar>
            </BlockControls>
        );
    }
 
    render() {
        const { attributes, setAttributes } = this.props;
        const ALLOWED_BLOCKS = [ 'kungfu/slide' ];       
        const TEMPLATE = [ [ 'kungfu/slide' ] ];
        const { clientId } = this.props;
        const parentBlock = select( 'core/editor' ).getBlocksByClientId( clientId )[ 0 ];
        const childBlocks = parentBlock.innerBlocks;

        function htmlToElement(html) {
            var template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }

        function Slider() {
            
            let slides = '';
            
            for(let slide of childBlocks) {

                let slideInner = '';

                if( slide.innerBlocks.length > 0 ) {

                    for(let inners of slide.innerBlocks) {

                        slideInner += inners.originalContent;

                    }

                }

                console.log(slideInner);
                
                let parser = new DOMParser();
                let parsedHtml = parser.parseFromString(slide.originalContent, "text/html");
                
                let thisSlide = parsedHtml.querySelector('.wp-block-kungfu-slide');
                let thisSlideContent = thisSlide.querySelector('.kungfu-slide-content');

                let t = htmlToElement(slideInner);
                
                thisSlideContent.appendChild(t);

                slides += '<li>'+thisSlide.innerHTML+'</li>';

                console.log(slides);
            }
            
           
           return <div uk-slider="autoplay: true">
                    <div className="uk-position-relative uk-visible-toggle" tabIndex="-1">
                        <ul className="uk-slider-items uk-child-width-1-1" dangerouslySetInnerHTML={{__html: slides}}></ul>
                    </div>
                </div>
        };

        return ([
            this.getInspectorControls(),
            this.getBlockControls(),
            <div className="kungfu-slider">
                {this.state.editMode && 
                    <InnerBlocks 
                        allowedBlocks={ ALLOWED_BLOCKS }
                        template={ TEMPLATE }
                    />
                }
                {!this.state.editMode && 
                    <Slider />
                }
            </div>
        ]);
    }
}

registerBlockType( 'kungfu/slider', {

    title: __( 'Slider', 'kungfu' ), 
    icon: 'format-image', 
    category: 'common', 
    keywords: [
        __( 'Slider', 'kungfu' ), 
    ],
    attributes: {
        textAlignment: {
            type: 'string',
        },
        arrows: {
            type: 'boolean',
            default: true
        },
        bullets: {
            type: 'boolean',
            default: true
        }
    },
    supports: {

        align: ['wide', 'full']

    },

    edit: SliderEdit,

    save: (props) => { 

        const { attributes } = props;

        function Arrows() {
            if( attributes.arrows)  {
                return <>
                    <a class="uk-position-center-left" href="#" uk-slidenav-previous="" uk-slider-item="previous"></a>
                    <a class="uk-position-center-right" href="#" uk-slidenav-next="" uk-slider-item="next"></a>
                </>;
            } else {
                return;
            }
        };

        function Bullets() {
            if( attributes.bullets)  {
                return <>
                    <ul class="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
                </>;
            } else {
                return;
            }
        };

        return (

            <div uk-slider="autoplay: true">

                <div className="uk-position-relative uk-visible-toggle"  tabIndex="-1">

                    <ul className={'uk-slider-items uk-child-width-1-1'}>
                    
                        <InnerBlocks.Content />

                    </ul>

                    <Arrows />

                </div>

                <Bullets />

            </div>
        );

    }

});
