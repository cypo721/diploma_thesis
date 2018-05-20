import React, { Component } from 'react';
import TabletStore from "../Stores/Tablet";
import CartStore from "../Stores/Cart";
import RichTextElement from '../Components/RichTextElement';
import { translate } from 'react-translate';
import NoImage from "../Images/No-image-found.jpg"

let getState = (props) => {
    return {
        tablet: TabletStore.getTablet(props.match.params.tabletSlug, props.language),
        cart: props.cart? CartStore.provideCart() : CartStore.getCart()
    };
};

class Tablet extends Component {

    constructor(props) {
        super(props);
        this.state = getState(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        TabletStore.addChangeListener(this.onChange);
        TabletStore.provideTablet(this.props.match.params.tabletSlug, this.props.language);
    }

    componentWillUnmount() {
        TabletStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.language !== nextProps.language || this.props.match.params.tabletSlug !== nextProps.match.params.tabletSlug) {
            TabletStore.provideTablet(nextProps.match.params.tabletSlug, nextProps.language);
        }
    }

    onChange() {
        this.setState(getState(this.props));
    }

    addItem(){
        console.log("adding");
        let cart = this.state.cart;
        let tablet = this.state.tablet;
        CartStore.addToCart(cart.id, tablet.id, cart.version);
    }

    render() {
        if (!this.state.tablet) {
            return (
                <div className="container"></div>
            );
        }

        let tablet = this.state.tablet;
        console.log("tabletslug" + tablet);
        let name = tablet ? tablet.name.en: "missing name";
        let imageLink =  tablet.mainPicture.value[0]? tablet.mainPicture.value[0].url : NoImage;
        let descriptionElement = tablet.description? tablet.description: "";


        return (
            <div className="container">
                <article className="product-detail">
                    <div className="row">
                        <div className="col-md-10">
                            <header>
                                <h2>{name}</h2>
                            </header>
                        </div>
                        <div className="col-md-2">
                            {tablet.masterVariant.prices[0]?
                                <button className="btn btn-primary" onClick={ () => this.addItem()}>{ this.props.t("add")}</button>
                                : null}
                        </div>
                    </div>
                    <div className="row-fluid">
                        <div className="col-md-6">
                            <figure className="image">
                                <img alt={name} className="" src={imageLink} title={name} />
                            </figure>
                        </div>
                        <div className="col-md-5 col-md-offset-1">
                            <div className="product-detail-properties">
                                <h4>{this.props.t("params")}</h4>
                                <dl>{
                                    tablet.masterVariant.attributes.map(function(atr){
                                        return <dl key={atr.name}>
                                                    <dt className="col-xs-12 col-sm-4">{this.props.t(atr.name.toLowerCase())}</dt>
                                                    {atr.name === "Price" ?
                                                        <dd className="col-xs-12 col-sm-8">{atr.value.centAmount / 100} {atr.value.currencyCode}</dd>:
                                                        <dd className="col-xs-12 col-sm-8">{atr.value}</dd>
                                                    }
                                                </dl>
                                    }, this)

                                }
                                    {/*{ tablet.masterVariant.attributes[1].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("battery")}</dt>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[1].value ? <dd className="col-xs-12 col-sm-8">{tablet.masterVariant.attributes[1].value}</dd>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[2].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("capacity")}</dt>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[2].value ? <dd className="col-xs-12 col-sm-8">{tablet.masterVariant.attributes[2].value}</dd>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[3].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("display")}</dt>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[3].value ? <dd className="col-xs-12 col-sm-8">{tablet.masterVariant.attributes[3].value}</dd>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[4].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("ram")}</dt>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[4].value ? <dd className="col-xs-12 col-sm-8">{tablet.masterVariant.attributes[4].value}</dd>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[5].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("os")}</dt>: null}*/}
                                    {/*{ tablet.masterVariant.attributes[5].value ? <dd className="col-xs-12 col-sm-8">{tablet.masterVariant.attributes[5].value}</dd>: null}*/}
                                </dl>
                            </div>
                        </div>
                     </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="description">
                                    <RichTextElement element={descriptionElement} />
                                </div>
                            </div>
                        </div>

                </article>
            </div>
        );
    }
}

export default translate("Tablet")(Tablet);
