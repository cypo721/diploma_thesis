import React, { Component } from 'react';
import Link from '../Components/LowerCaseUrlLink';
import MobileStore from "../Stores/Mobile";

import NoImage from "../Images/No-image-found.jpg"

let getState = (props) => {
    return {
        notebooks: MobileStore.getMobiles(props.language),
        filter: MobileStore.getFilter()
    };
};
/*
Lists mobiles in store
 */
class Mobiles extends Component {

    constructor(props) {
        super(props);

        this.state = getState(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        MobileStore.addChangeListener(this.onChange);
        MobileStore.provideMobiles(this.props.language);
    }

    componentWillUnmount() {
        MobileStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.language !== nextProps.language) {
            MobileStore.provideMobiles(nextProps.language);
        }
    }

    onChange() {
        this.setState(getState(this.props));
    }

    render() {
        let formatPrice = (price, language, curr) => {
            return price.toLocaleString(language, {
                style: "currency",
                currency: curr
            });
        };

        let filter = (mobile) => {
            return this.state.filter.matches(mobile);
        };

        let mobiles = this.state.notebooks.filter(filter).map((mobile, index) => {
            let price = mobile.masterVariant.prices[0]?
                formatPrice(mobile.masterVariant.prices[0].value.centAmount / 100, this.props.language, mobile.masterVariant.prices[0].value.currencyCode)
                : "missing price";
            let name = mobile.name? mobile.name.value : "missing name";
            let imageLink = mobile.mainPicture.value[0]? mobile.mainPicture.value[0].url : NoImage;
            let link = `/${this.props.language}/mobiles/${mobile.id}`;

            return (
                <div className="col-md-6 col-lg-4" key={index}>
                    <article className="product-tile">
                        <Link to={link}>
                            <h1 className="product-heading">{name}</h1>
                            {status}
                            <figure className="product-tile-image">
                                <img alt={name} className="" src={imageLink} title={name} />
                            </figure>
                            <div className="product-tile-info">
                <span className="product-tile-price">
                  {price}
                </span>
                            </div>
                        </Link>
                    </article>
                </div>
            );
        });

        return (
            <div id="product-list" className="col-md-8 col-lg-9 product-list">
                {mobiles}
            </div>
        );
    }
}

export default Mobiles;