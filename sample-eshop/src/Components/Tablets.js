import React, { Component } from 'react';
import Link from '../Components/LowerCaseUrlLink';
import TabletStore from "../Stores/Tablet";

import NoImage from "../Images/No-image-found.jpg"

let getState = (props) => {
    return {
        tablets: TabletStore.getTablets(props.language),
        filter: TabletStore.getFilter()
    };
};

class Tablets extends Component {

    constructor(props) {
        super(props);

        this.state = getState(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        TabletStore.addChangeListener(this.onChange);
        TabletStore.provideTablets(this.props.language);
    }

    componentWillUnmount() {
        TabletStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.language !== nextProps.language) {
            TabletStore.provideTablets(nextProps.language);
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

        let filter = (tablet) => {
            return this.state.filter.matches(tablet);
        };

            let tablets = this.state.tablets.filter(filter).map((tablet, index) => {
            console.log(tablet);
            let price = tablet.masterVariant.prices[0]?
                formatPrice(tablet.masterVariant.prices[0].value.centAmount / 100, this.props.language, tablet.masterVariant.prices[0].value.currencyCode)
                :"missing price";
            let name = tablet.name? tablet.name.value : "missing name";
            let imageLink = tablet.mainPicture.value[0]? tablet.mainPicture.value[0].url : NoImage;
            let link = `/${this.props.language}/tablets/${tablet.id}`;

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
                {tablets}
            </div>
        );
    }
}

export default Tablets;