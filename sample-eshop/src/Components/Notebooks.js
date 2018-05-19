import React, { Component } from 'react';
import Link from '../Components/LowerCaseUrlLink';
import NotebookStore from "../Stores/Notebook";

import NoImage from "../Images/No-image-found.jpg"

let getState = (props) => {
    return {
        notebooks: NotebookStore.getNotebooks(props.language),
        filter: NotebookStore.getFilter()
    };
};

class Notebooks extends Component {

    constructor(props) {
        super(props);

        this.state = getState(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        NotebookStore.addChangeListener(this.onChange);
        NotebookStore.provideNotebooks(this.props.language);
    }

    componentWillUnmount() {
        NotebookStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.language !== nextProps.language) {
            NotebookStore.provideNotebooks(nextProps.language);
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


        let filter = (notebook) => {
            return this.state.filter.matches(notebook);
        };

        let notebooks = this.state.notebooks.filter(filter).map((notebook, index) => {
            console.log(notebook);
            let price = formatPrice(notebook.masterVariant.attributes[6].value.centAmount / 100, this.props.language, notebook.masterVariant.attributes[6].value.currencyCode);
            let name = notebook.name.value;
            let imageLink = notebook.mainPicture.value[0]? notebook.mainPicture.value[0].url : NoImage;
            let link = `/${this.props.language}/notebooks/${notebook.id}`;

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
                {notebooks}
            </div>
        );
    }
}

export default Notebooks;