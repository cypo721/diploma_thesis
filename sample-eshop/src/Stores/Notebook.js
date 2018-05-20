import Client from "../Client.js";
import CommerceClient from "../CommerceClient"
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes'

let changeListeners = [];
let notebooks = initLanguageCodeObject();
let comNotebooks;

let notifyChange = () => {
    changeListeners.forEach((listener) => {
        listener();
    });
};

const request = {
    uri: '/kentico-cloud-integration-63/product-projections/search?filter=productType.id:"9177eac7-0c40-4ace-b084-fb26d6ffa3a8"',
    method: 'GET',

};

let fetchNotebooks = (language) => {
    console.log("query " + language);
    var query = Client.items()
        .type('notebook');

    if (language) {
      query.languageParameter(language);
    }

    CommerceClient().execute(request)
        .then(result => {
            console.log(result);
            notebooks[language] = result;
            query.get()
                .subscribe(response => {
                    var res = [];
                    if (language) {
                        comNotebooks = notebooks[language];
                        notebooks[language] = response.items;
                        console.log(response.items);
                        comNotebooks.body.results.forEach(function(el){
                            var match = notebooks[language].find(function(e){
                                return e.externalSourceId.value === el.id;
                            });
                            if (match) {
                                el = Object.assign(match, el);
                                console.log(el);
                                res.push(el);
                            }
                        })
                        console.log(res);
                        notebooks[language] = res;
                        console.log(notebooks[language]);
                    } else {
                        comNotebooks = notebooks[defaultLanguage];
                        notebooks[defaultLanguage] = response.items;
                        comNotebooks.body.results.forEach(function(el){
                            var match = notebooks[defaultLanguage].find(function(e){
                                return e.externalSourceId.value === el.id;
                            });
                            el = Object.assign(match, el);
                            console.log(el);
                            res.push(el);
                        });
                        console.log(res);
                        notebooks[defaultLanguage] = res;
                        console.log(notebooks[defaultLanguage]);
                    }

                    notifyChange();
                });
        });

}

export class Filter {
    matches(notebook) {
        return true;
    }
}

let notebookFilter = new Filter();

class NotebookStore {

    // Actions

    provideNotebook(notebookSlug, language) {
        fetchNotebooks(language);
    }

    provideNotebooks(language) {
        fetchNotebooks(language);
    }

    // Methods

    getNotebook(notebookSlug, language) {
        ;
        return notebooks[language || defaultLanguage].find((notebook) => notebook.id === notebookSlug);
    }

    getNotebooks(language) {
        return notebooks[language];
    }

    getFilter() {
        return notebookFilter;
    }

    setFilter(filter) {
        notebookFilter = filter;
        notifyChange();
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

export default new NotebookStore();
