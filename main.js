
// If web3 has already been injected by MetaMask extension, then use it.
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // Otherwise we use our testrpc provider running on localhost
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];


var ABI =
    [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "groceriesList",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes16"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getList",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes16[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "groceriesList",
                    "type": "bytes16[]"
                }
            ],
            "name": "ListUpdated",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_item",
                    "type": "bytes16"
                }
            ],
            "name": "addItem",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

const contract = web3.eth
    .contract(ABI)
    .at("0x481e85716a7e5477a30e4a26dfd19904a93ff2e6");

class Application {
    constructor(form, list, contract) {
        this.form = form;
        this.list = list;
        this.contract = contract;

        contract.ListUpdated({}, 'latest').watch( (error, result) => {
            if (error) {
                console.error('');
            } else {
                let list = result.args.groceriesList.map(item => web3.toAscii(item));
                this.list.update(list);
            }

            this.resetForm();
        });

        contract.getList((error, result) => {
            if (!error) {
                let list = result.map(item => web3.toAscii(item));
                this.list.update(list);
            }
        });

        this.form.subscribeForSubmit(() => this.onSubmitClick());
    }

    onSubmitClick() {
        this.form.showSpinner();

        let value = this.form.getInputValue();

        value = web3.fromAscii(value);

        contract.addItem(value, (error, result) => {
            if (error) {
                this.resetForm();
            }
        });
    }

    resetForm() {
        this.form.hideSpinner();
        this.form.clearInput();
    }
}

class Form {
    constructor() {
        this.inputElement = document.getElementById('item');
        this.buttonElement = document.getElementById('button');
        this.spinnerElement = document.getElementById('spinner');

        this.buttonElement.addEventListener('click', () => this.onButtonClick());
    }

    getInputValue() {
        return this.inputElement.value;
    }

    clearInput() {
        this.inputElement.value = '';
    }

    onButtonClick() {
        this.submitCallback();
    }

    subscribeForSubmit(callback) {
        this.submitCallback = callback;
    }

    hideSpinner() {
        this.spinnerElement.classList.add('hidden');
    }

    showSpinner() {
        this.spinnerElement.classList.remove('hidden');
    }
}

class List {
    constructor() {
        this.listElement = document.getElementById('list');
    }

    update(listItems) {
        const items = this.generateItems(listItems);
        this.listElement.innerHTML = items;
    }

    generateItems(listItems) {
        let items = ``;

        listItems.forEach(listItem => {
            items = items + `<li>${listItem}</li>`;
        });

        return items;
    }
}

new Application(
    new Form(),
    new List(),
    contract
);