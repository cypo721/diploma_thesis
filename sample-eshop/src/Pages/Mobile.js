import React, { Component } from 'react';
import MobileStore from "../Stores/Mobile";
import RichTextElement from '../Components/RichTextElement';
import { translate } from 'react-translate';
import CartStore from "../Stores/Cart"

import NoImage from "../Images/No-image-found.jpg"

let getState = (props) => {
    return {
        mobile: MobileStore.getMobile(props.match.params.mobileSlug, props.language),
        cart: props.cart? CartStore.provideCart() : CartStore.getCart()
    };
};
/*
Shows mobile detail page.
 */
class Mobile extends Component {

    constructor(props) {
        super(props);
        this.state = getState(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        MobileStore.addChangeListener(this.onChange);
        MobileStore.provideMobile(this.props.match.params.mobileSlug, this.props.language);
    }

    componentWillUnmount() {
        MobileStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.language !== nextProps.language || this.props.match.params.mobileSlug !== nextProps.match.params.mobileSlug) {
            MobileStore.provideMobile(nextProps.match.params.mobileSlug, nextProps.language);
        }
    }

    onChange() {
        this.setState(getState(this.props));
    }

    addItem(){
        let cart = this.state.cart;
        let mobile = this.state.mobile;
        CartStore.addToCart(cart.id, mobile.id, cart.version);
    }

    render() {
        if (!this.state.mobile) {
            return (
                <div className="container"></div>
            );
        }

        let mobile = this.state.mobile;
        let name = mobile.name?  mobile.name.en : "missing name";
        let imageLink = mobile.mainPicture.value[0]? mobile.mainPicture.value[0].url : NoImage;
        let descriptionElement = mobile.description? mobile.description : "";

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
                            {mobile.masterVariant.prices[0]?
                                <button className="btn btn-primary" onClick={() => this.addItem()}>{ this.props.t("add")}</button>
                                :null}
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
                                <dl>
                                    {
                                        mobile.masterVariant.attributes.map(function(atr){
                                            return <dl key={atr.name}>
                                                        <dt className="col-xs-12 col-sm-4">{this.props.t(atr.name.toLowerCase())}</dt>
                                                        {atr.name === "Price" ?
                                                            <dd className="col-xs-12 col-sm-8">{atr.value.centAmount / 100} {atr.value.currencyCode}</dd>:
                                                            <dd className="col-xs-12 col-sm-8">{atr.value}</dd>
                                                        }
                                                    </dl>
                                        }, this)

                                    }
                                    {/*{ mobile.masterVariant.attributes[1].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("capacity")}</dt>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[1].value ? <dd className="col-xs-12 col-sm-8">{mobile.masterVariant.attributes[1].value}</dd>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[2].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("camera")}</dt>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[2].value ? <dd className="col-xs-12 col-sm-8">{mobile.masterVariant.attributes[2].value}</dd>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[3].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("procesor")}</dt>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[3].value ? <dd className="col-xs-12 col-sm-8">{mobile.masterVariant.attributes[3].value}</dd>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[0].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("display")}</dt>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[0].value ? <dd className="col-xs-12 col-sm-8">{mobile.masterVariant.attributes[0].value}</dd>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[6].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("os")}</dt>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[6].value ? <dd className="col-xs-12 col-sm-8">{mobile.masterVariant.attributes[6].value}</dd>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[4].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("battery")}</dt>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[4].value ? <dd className="col-xs-12 col-sm-8">{mobile.masterVariant.attributes[4].value}</dd>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[5].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("sim")}</dt>: null}*/}
                                    {/*{ mobile.masterVariant.attributes[5].value ? <dd className="col-xs-12 col-sm-8">{mobile.masterVariant.attributes[5].value}</dd>: null}*/}
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

export default  translate("Mobile")(Mobile);
