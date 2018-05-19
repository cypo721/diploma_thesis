import React, { Component } from 'react';
import NotebookStore from "../Stores/Notebook";
import RichTextElement from '../Components/RichTextElement';
import { translate } from 'react-translate';
import CartStore from "../Stores/Cart"

let getState = (props) => {
    return {
        notebook: NotebookStore.getNotebook(props.match.params.notebookSlug, props.language),
        cart: props.cart? CartStore.provideCart() : CartStore.getCart()
    };
};

class Notebook extends Component {

    constructor(props) {
        super(props);
        this.state = getState(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        NotebookStore.addChangeListener(this.onChange);
        NotebookStore.provideNotebook(this.props.match.params.notebookSlug, this.props.language);
    }

    componentWillUnmount() {
        NotebookStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.language !== nextProps.language || this.props.match.params.notebookSlug !== nextProps.match.params.notebookSlug) {
            NotebookStore.provideNotebook(nextProps.match.params.notebookSlug, nextProps.language);
        }
    }

    onChange() {
        this.setState(getState(this.props));
    }

    addItem(){
        console.log("adding");
        let cart = this.state.cart;
        let notebook = this.state.notebook;
        CartStore.addToCart(cart.id, notebook.id, cart.version);
    }

    render() {
        if (!this.state.notebook) {
            return (
                <div className="container"></div>
            );
        }

        let notebook = this.state.notebook;
        console.log("notebookslug" + notebook.id);
        let name = notebook.name.en;
        let imageLink = notebook.mainPicture.value[0].url;
        let descriptionElement = notebook.description;

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
                            <button className="btn btn-primary" onClick={() => this.addItem()}>{ this.props.t("add")}</button>
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
                                    { notebook.masterVariant.attributes[1].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("capacity")}</dt>: null}
                                    { notebook.masterVariant.attributes[1].value ? <dd className="col-xs-12 col-sm-8">{notebook.masterVariant.attributes[1].value}</dd>: null}
                                    { notebook.masterVariant.attributes[2].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("disk")}</dt>: null}
                                    { notebook.masterVariant.attributes[2].value ? <dd className="col-xs-12 col-sm-8">{notebook.masterVariant.attributes[2].value.label}</dd>: null}
                                    { notebook.masterVariant.attributes[3].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("procesor")}</dt>: null}
                                    { notebook.masterVariant.attributes[3].value ? <dd className="col-xs-12 col-sm-8">{notebook.masterVariant.attributes[3].value}</dd>: null}
                                    { notebook.masterVariant.attributes[0].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("ram")}</dt>: null}
                                    { notebook.masterVariant.attributes[0].value ? <dd className="col-xs-12 col-sm-8">{notebook.masterVariant.attributes[0].value}</dd>: null}
                                    { notebook.masterVariant.attributes[5].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("os")}</dt>: null}
                                    { notebook.masterVariant.attributes[5].value ? <dd className="col-xs-12 col-sm-8">{notebook.masterVariant.attributes[5].value}</dd>: null}
                                    { notebook.masterVariant.attributes[4].value ? <dt className="col-xs-12 col-sm-4">{this.props.t("display")}</dt>: null}
                                    { notebook.masterVariant.attributes[4].value ? <dd className="col-xs-12 col-sm-8">{notebook.masterVariant.attributes[4].value}</dd>: null}
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

export default translate("Notebook")(Notebook);
