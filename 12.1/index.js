const cities = [
    { id: 1, name: "Харьков" },
    { id: 2, name: "Киев" },
    { id: 3, name: "Львов" },
    { id: 4, name: "Черновцы" },
    { id: 5, name: "Сумы" },
];

// The same set for every city for simplicity
const warehouses = [
    { id: 1, name: "Отделение 1" },
    { id: 2, name: "Отделение 2" },
    { id: 3, name: "Отделение 3" },
    { id: 4, name: "Отделение 4" },
    { id: 5, name: "Отделение 5" },
];

const paymentTypes = [
    { name: "Наличные", value: 0 },
    { name: "Карта", value: 1 }
];

class Product {
    constructor(id, name, category, price, description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
    }
}

class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.products = [];
    }

    addProduct(id, name, price, description) {
        const p = new Product(id, name, this, price, description);
        this.products.push(p);

        return this;
    }
}

class BuyForm {
    firstName;
    lastName;
    city;
    warehouse;
    paymentType;
    amount;
    comment;
    selectedProduct;

    #validators = [
        () => this.firstName && this.firstName.length ?
                { success: true } :
                { success: false, field: 'firstName', message: "Укажите имя." },

        () => this.lastName && this.lastName.length ?
                { success: true } :
                { success: false, field: 'lastName', message: "Укажите фамилию." },

        () => this.city && this.city.id ?
                { success: true } :
                { success: false, field: 'city', message: "Выберите город." },

        () => this.warehouse && this.warehouse.id ?
                { success: true } :
                { success: false, field: 'warehouse', message: "Выберите склад." },

        () => this.amount > 0 ?
                { success: true } :
                { success: false, field: 'amount', message: 'Укажите количество.' }
    ];

    bind() {
        const firstNameInpt = document.querySelector('input[name="firstName"]');
        const lastNameInpt = document.querySelector('input[name="lastName"]');
        const citySelect = document.querySelector('select[name="city"]');
        const warehouseSelect = document.querySelector('select[name="warehouse"]');
        const paymentTypeInpt = document.querySelector('input[name="paymentType"]');
        const amountInpt = document.querySelector('input[name="amount"]');
        const commentInpt = document.querySelector('textarea[name="comment"]');

        this.firstName = firstNameInpt.value;
        this.lastName = lastNameInpt.value;
        this.city = cities.find(c => c.id == citySelect.value);
        this.warehouse = warehouses.find(w => w.id == warehouseSelect.value);
        this.paymentType = paymentTypes.find(p => p.value == paymentTypeInpt.value);
        this.amount = Number(amountInpt.value);
        this.comment = commentInpt.value;
    }

    validate() {
        const errors = [];
        this.#validators.forEach((validator, _) => {
            const result = validator();
            if (!result.success) {
                const { field, message } = result;
                errors.push({ field, message });
            }
        });

        if (!errors.length) {
            return {
                success: true
            };
        }

        return {
            success: false,
            errors
        };
    }
}

class PageModel {
    categories = [];
    buyForm = new BuyForm();

    init() {
        
        this.categories = [
                new Category("1","Мясные продукты")
                .addProduct("121", "Отбивные (свинина)", "8.60 &euro;", "Отличные свежие отбивные из свинины, 800 г")
                .addProduct("122", "Отбивные (телятина)", "7.30 &euro;", "Отбивные 1кг")
                .addProduct("123", "Стейк Рибай", "24.20 &euro;", "Большой и сочный стейк Рибай высшего сорта")
                .addProduct("124", "Фарш куринный", "5.99 &euro;", "1.2 кг фарш")
                .addProduct("125", "Буженина", "15.89 &euro;", "Свежая буженина свинная запеченная 1.8 кг"),
            new Category("2", "Рыба")
                .addProduct("126", "Лосось слабосоленный", "7.40 &euro;", "Филе лосося слабосоленное, 1 кг")
                .addProduct("127", "Мойва замороженная", "2.99 &euro;", "Мойва замороженная, крупная, 1 кг")
                .addProduct("128", "Скумбрия копченная", "4.00 &euro;", "Скумбрия горячего копчения, 1 кг")
        ];

        const categoriesList = document.getElementsByClassName("categories-list")[0];
        categoriesList.innerHTML = "";

        for (const category of this.categories) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            const categoryId = category.id;

            link.href = "javascript:void(0)";
            link.text = category.name;
            li.setAttribute("category-id", category.id);
            
            link.onclick = () => this.#applyCategory(categoryId);

            li.appendChild(link);
            categoriesList.appendChild(li);
        }

        const citySelect = document.querySelector('select[name="city"]');
        const cityPlaceholder = document.createElement('option');
        cityPlaceholder.text = "Ваш город..";
        cityPlaceholder.selected = true;
        citySelect.appendChild(cityPlaceholder);

        const warehouseSelect = document.querySelector('select[name="warehouse"]');
        const warehousePlaceholder = document.createElement('option');
        warehousePlaceholder.text = 'Ваш склад';
        warehousePlaceholder.selected = true;
        warehouseSelect.appendChild(warehousePlaceholder);

        const addOptions = (select, optionList) => {
            optionList.forEach((it, _) => {
                const option = document.createElement('option');
                option.value = it.id;
                option.innerText = it.name;
                select.appendChild(option);
            });
        };

        addOptions(citySelect, cities);
        addOptions(warehouseSelect, warehouses);

        document.getElementById('buy-form').onsubmit = (evt) => {
            evt.preventDefault();
            this.buyForm.bind();

            const validationResult = this.buyForm.validate();

            if (!validationResult.success) {
                // show errors in the form
                validationResult.errors.forEach((e, _) => {
                    const field = e.field;
                    const errorMessageContainer = document.querySelector(`div[for="${field}"]`);
                    errorMessageContainer.innerText = e.message;
                    errorMessageContainer.style.display = 'block';
                });

                return false;
            }

            const fields = ["firstName", "lastName", "city", "warehouse", "paymentType", "amount", "comment"];

            fields.forEach((field, _) => {
                let fieldValue = this.buyForm[field];

                switch (field) {
                    case "city":
                    case "warehouse":
                    case "paymentType":
                        fieldValue = fieldValue.name;
                        break;
                }

                document.getElementById(`td_${field}`).innerText = fieldValue;
            });

            const selectedProduct = this.buyForm.selectedProduct;

            document.getElementById('product-submitted').innerHTML = `Выбранный товар: <b>${selectedProduct.name}</b>, цена: <b>${selectedProduct.price}</b>`;

            document.getElementById('results-container').style.display = 'block';
            document.getElementsByClassName('products-holder')[0].style.display = 'none';
            document.getElementsByClassName('product-details-holder')[0].style.display = 'none';

            return false;
        };

        const hideValidationError = (e) => {
            const element = e.srcElement || e.target;
            const name = element.getAttribute('name');
            const message = document.querySelector(`div.validation-error[for="${name}"]`);

            if (message && message.style.display != 'none') {
                message.style.display = 'none';
            }
        };

        document.querySelectorAll('input')
            .forEach(i => i.onblur = hideValidationError);

        document.querySelectorAll('select')
            .forEach(i => i.onchange = hideValidationError);
    }

    #applyCategory(id) {
        const productsList = document.getElementsByClassName('products-list')[0];
        productsList.innerHTML = '';

        const category = this.categories.find(c => c.id == id);
        if (!category) {
            return;
        }

        for (const product of category.products) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = "javascript:void(0)";
            link.text = product.name;
            li.setAttribute('product-id', product.id);
            link.onclick = () => this.#applyProductDetails(product);

            li.appendChild(link);
            productsList.appendChild(li);
        }

        const productContainer = document.getElementsByClassName('product-holder-inner')[0];
        productContainer.style.display = 'block';
        productContainer.querySelector('.title').innerHTML = category.name;
        document.getElementsByClassName('product-placeholder')[0].style.display = 'none';

        const categoryList = document.getElementsByClassName('categories-list')[0].querySelectorAll('li');
        categoryList.forEach((li, _) => {
            const categoryId = li.getAttribute('category-id');
            const link = li.querySelector('a');
            if (categoryId === id) {
                link.classList.add('selected');
            } else {
                link.classList.remove('selected');
            }
        });

        document.getElementById('results-container').style.display = "none";
        document.getElementsByClassName('products-holder')[0].style.display = 'block';
    }

    #applyProductDetails(product) {
        const detailsContainer = document.getElementsByClassName('product-details-holder')[0];
        detailsContainer.querySelector('.title').innerHTML = product.name;

        const innerContainer = detailsContainer.querySelector('.product-details');
        innerContainer.querySelector('.product-price').innerHTML = `Цена: ${product.price}`;
        innerContainer.querySelector('.product-description').innerHTML = product.description;
        detailsContainer.style.display = 'block';

        const productBuyBtn = document.getElementById('productBuyBtn');
        productBuyBtn.onclick = () => {
            document.getElementById('buy-form-container').style.display = 'block';
            productBuyBtn.style.display = 'none';
            this.buyForm.selectedProduct = product;
        };

        const productList = document.getElementsByClassName('products-list')[0].querySelectorAll('li');
        productList.forEach((li, _) => {
            const productId = li.getAttribute('product-id');
            const link = li.querySelector('a');
            if (productId === product.id) {
                link.classList.add('selected');
            } else {
                link.classList.remove('selected');
            }
        });
    }
}

window.onload = () => {
    const pageModel = new PageModel();
    pageModel.init();
};