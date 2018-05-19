import CommerceClient from "../CommerceClient"

let changeListeners = [];
let cart;
let addRequest;
let removeRequest;
let orderRequest;

let notifyChange = () => {
    changeListeners.forEach((listener) => {
        listener();
    });
}

const create = {
    uri: '/kentico-cloud-integration-63/carts/',
    method: 'POST',
    body: {
        'currency': 'EUR'
    }
};

let add = (cartId, productId, version) => {
    addRequest = {
        uri: '/kentico-cloud-integration-63/carts/' + cartId,
        method: 'POST',
        body: {
                "actions": [{
                    "action": "addLineItem",
                    "productId": productId
            },
            {
                "action": "setShippingAddress",
                "address":{
                    "id": "testovacia adresa",
                    "country": "SK"
                }
            }],
            "version": version
        }
    }
};

let remove = (cartId, productId, version) => {
    removeRequest = {
        uri: '/kentico-cloud-integration-63/carts/' + cartId,
        method: 'POST',
        body: {
            "actions": [{
                "action": "removeLineItem",
                "lineItemId": productId
            }],
            "version": version
        }
    }
};

let order = (cartId, version) => {
    orderRequest = {
        uri: '/kentico-cloud-integration-63/orders',
        method: 'POST',
        body: {
            'id': cartId,
            'version': version
        }
    }
};

export const createCart = () => {
    CommerceClient.execute(create)
        .then(result => {
            cart = result.body;
            notifyChange();
        });
};

let addItem = (cartId, productId, version) => {
    add(cartId, productId, version);
    CommerceClient.execute(addRequest)
        .then(result => {
            cart = result.body;
            notifyChange();
        });
};

let removeItem = (cartId, productId, version) => {
    remove(cartId, productId, version);
    CommerceClient.execute(removeRequest)
        .then(result => {
            cart = result.body;
            notifyChange();
        });
};

let sendOrder = (cartId, version) => {
    order(cartId, version);
    CommerceClient.execute(orderRequest)
        .then(result => {
            console.log(result);
            notifyChange();
        });
}

class CartStore {

    // Actions

    provideCart() {
        createCart();
    }

    addToCart(cartId, productId, version) {
        addItem(cartId,productId,version);
    }

    removeFromCart(cartId, productId, version) {
        removeItem(cartId,productId,version);
    }

    createOrder(cartId, version){
        sendOrder(cartId, version);
        createCart();
    }
    // Methods

    getCart() {
        return cart;
    }
    // Listeners

    addChangeListener(listener) {
        changeListeners.push(listener);
    }

    removeChangeListener(listener) {
        changeListeners = changeListeners.filter((element) => {
            return element !== listener;
        });
    }

}

export default new CartStore();