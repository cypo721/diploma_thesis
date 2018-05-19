import React, { Component } from 'react';
import CartStore from "../Stores/Cart";
import { translate } from 'react-translate';

let getState = (props) => {
    return {
        cart: props.cart? CartStore.provideCart() : CartStore.getCart(),
    };
};

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = getState(props);
        this.onChange = this.onChange.bind(this);
        this.status = undefined;
    }

    componentDidMount() {
        CartStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        CartStore.removeChangeListener(this.onChange);
    }

    onChange() {
        this.setState(getState(this.props));
    }

    removeItem(cartId, itemId, version){
        CartStore.removeFromCart(cartId, itemId, version);
    }

    sendOrder(cartId, version){
        console.log("order");
        CartStore.createOrder(cartId,version);
        this.status= this.props.t('obj');
    }

    render() {
        if (this.state.cart.lineItems.length === 0) {
            return (
                <div className="container">
                    <h2>{this.props.t("cart")}</h2>
                    {
                        this.state? <div><h3>{this.status}</h3></div> : null
                    }
                </div>
            );
        }

        return (
            <div className="container">
                <h2>{this.props.t("cart")}</h2>
                {
                    this.state.cart.lineItems.map(item =>
                        <div className="row" key={item.id}>
                            <div className="col-md-10">
                                <header>
                                    <h2>{item.name.en}</h2>
                                </header>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-danger" onClick={ () => this.removeItem(this.state.cart.id, item.id, this.state.cart.version)}>
                                    { this.props.t("remove")}</button>
                            </div>

                        </div>
                    )
                }
                {
                    this.state.cart.lineItems.length !== 0 ?
                        <div className="row">
                            <div className="col-md-12" style={{textAlign: "center"}}>
                            <button className="btn btn-primary" onClick={() => this.sendOrder(this.state.cart.id, this.state.cart.version)}>
                                { this.props.t("order")}</button>
                            </div>
                        </div> : null
                }
            </div>
        );
    }
}

export default translate("Cart")(Cart);
