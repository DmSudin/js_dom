// import escapeHtml from './utils/escape-html.js';
// import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
    element;
    subElements;
    defaultFormData = {
        title: '',
        description: '',
        quantity: 1,
        subcategory: '',
        status: 1,
        images: [],
        price: 100,
        discount: 0
      };

    onClick = () => {
        const {imageListContainer} = this.subElements;
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        document.body.append(fileInput);
        fileInput.hidden = true;
        fileInput.addEventListener('change', async () => {              
            const imgUploader = new ImageUploader();
            const [file] = fileInput.files;
            const responce = await imgUploader.upload(file);
            const li = document.createElement('li');
            imageListContainer.append(li);
            li.outerHTML = this.getSinglePhotoTemplate(file.name, responce.data.link);
        });
        fileInput.click();
    }

    onSubmit = event => {
        event.preventDefault();
        this.save();
    }

    constructor(productId = undefined) {
        this.productId = productId;
        // console.error('this', this);
    }

    async render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getFormTemplate();
        this.element = wrapper.firstElementChild;
        this.getSubElements();
        this.initEventListeners();
        await this.update();
    }

    getFormTemplate() {
        return `
        <div class="product-form">

            <form data-element="productForm" class="form-grid">
                <div class="form-group form-group__half_left">
                    <fieldset>
                        <label class="form-label">Название товара</label>
                        <input required id="title" value="" type="text" name="title" class="form-control" placeholder="Название товара">
                    </fieldset>
                </div>

                <div class="form-group form-group__wide">
                    <label class="form-label">Описание</label>
                    <textarea required id="description" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
                </div>

                <div class="form-group form-group__wide">
                    <label class="form-label">Фото</label>

                    <ul class="sortable-list" data-element="imageListContainer">
                    </ul>

                    <button data-element="uploadImage" type="button" class="button-primary-outline">
                        <span>Загрузить</span>
                    </button>
                </div>

                <div class="form-group form-group__half_left">
                    <label class="form-label">Категория</label>
                    <select class="form-control" id="subcategory" name="subcategory"></select>
                </div>

                <div class="form-group form-group__half_left form-group__two-col">
                    <fieldset>
                        <label class="form-label">Цена ($)</label>
                        <input required id="price" value type="number" name="price" class="form-control" placeholder="100">
                    </fieldset>
                    <fieldset>
                        <label class="form-label">Скидка ($)</label>
                        <input required id="discount" value="" type="number" name="discount" class="form-control" placeholder="0">
                    </fieldset>
                </div>

                <div class="form-group form-group__part-half">
                    <label class="form-label">Количество</label>
                    <input required id="quantity" value="" type="number" class="form-control" name="quantity" placeholder="1">
                </div>

                <div class="form-group form-group__part-half">
                    <label class="form-label">Статус</label>
                    <select id="status" class="form-control" name="status">
                        <option value="1">Активен</option>
                        <option value="0">Неактивен</option>
                    </select>
                </div>

                <div class="form-buttons">
                    <button type="submit" name="save" class="button-primary-outline">
                    Сохранить товар
                    </button>
                </div>
            </form>
        </div>
        `;
    }

    getSinglePhotoTemplate(source, url) {
        return `
        <li class="products-edit__imagelist-item sortable-list__item">
        <span>
            <img src="./icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="${source}" src="${url}">
            <span>${source}</span>
        </span>
        <button type="button">
            <img src="./icon-trash.svg" alt="delete" data-delete-handle="">
        </button>
    </li>`;
    }

    getSubElements() {
        this.subElements = {};
        const arr = Array.from(this.element.querySelectorAll('[data-element]'));
        arr.forEach(item => {
            const propertyName = item.dataset.element;
            this.subElements[propertyName] = item;
        });
        // console.error('subElements', this.subElements);
    }

    initEventListeners() {
        const {uploadImage, productForm, imageListContainer} = this.subElements;
        uploadImage.addEventListener('click', this.onClick);
        productForm.addEventListener('submit', this.onSubmit);
        imageListContainer.addEventListener('click', event => {
            if (event.target.closest('button')) {
                const elem = event.target.closest('li');
                elem.remove();
            }
        });
    }

    dispatchEvent(id) {
        const event = this.productId? 
        new CustomEvent('product-updated', {detail: id})
        : new CustomEvent('product-saved');

        this.element.dispatchEvent(event);
    }

    async loadData(category, loadParams) {
        const url = new URL(`/api/rest/${category}`, BACKEND_URL);

        for (let key in loadParams) {
            url.searchParams.set(key, loadParams[key]);
        }
        
        let json;
        try {
            const responce = await fetch(url);
            if (responce.ok) {
                json = await responce.json();
                return json;
            } else {
                return null;
            }
        } catch (e) {
            alert(e);
        }
    }

    async update() {
        if (this.productId) {
            const searchParams = {
                'id': this.productId,
            };
            
            let [productData, categories] = await Promise.all([this.loadData('products', searchParams), this.getCategories()]);
            if (!productData.length) {
                const element = document.createElement('div');
                element.innerHTML = this.getEmptyFormHtml();
                this.element = element.firstElementChild;
                return;
            }
    
            this.data = productData[0];
    
            this.subElements.productForm.title.value = this.data.title;
            this.subElements.productForm.price.value = this.data.price;
            this.subElements.productForm.discount.value = this.data.discount;
            this.subElements.productForm.quantity.value = this.data.quantity;
            this.subElements.productForm.status.value = this.data.status;
            this.subElements.productDescription.innerText = this.data.description;
            
            this.subElements.productForm.subcategory.innerHTML = categories;
            this.subElements.productForm.subcategory.value = this.data.subcategory;
    
            this.subElements.imageListContainer.innerHTML = this.getPhoto();
        } else {
            this.subElements.productForm.subcategory.innerHTML = await this.getCategories();
            debugger
        }
        
    }

    getEmptyFormHtml() {
        return `<div>
        <h1 class="page-title">Страница не найдена</h1>
        <p>Извините, данный товар не существует</p>
      </div>`
    }

    async save() {
        const product = this.getFormData();
        // console.error('product', product);

        const url = new URL(`/api/rest/products`, BACKEND_URL);
        try {
            const responce = await fetch(url, {
                method: this.productId ? 'PATCH': 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(product)
            });
            let result;
            if (responce.ok) {
                result = await responce.json();
            }
            this.dispatchEvent(result.id);
        } catch (error) {
            // console.error('Smth went wrong', error);
        }
    }

    getFormData() {
        const {productForm, imageListContainer} = this.subElements;
        const excludedFields = ['images'];
        const formatNumber = ['price', 'quantity', 'discount', 'status'];
        const fields = Object.keys(this.defaultFormData).filter(item => !excludedFields.includes(item));
        const getValue = field => productForm.querySelector(`[name=${field}]`).value;
        const values = {};

        for (const field of fields) {
            const value = getValue(field);
            values[field] = formatNumber.includes(field) ? parseInt(value) : value;
        }

        const imagesHTMLCollection = imageListContainer.querySelectorAll('.sortable-table__cell-img');
        values.images = [];
        values.id = this.productId;

        for (const image of imagesHTMLCollection) {
            values.images.push({
                url: image.src,
                source: image.alt,
            });
        }

        return values;

    }

    async getCategories() {
        let resultString = '';

        let searchParams = {
            '_sort': 'weight',
            '_refs': 'subcategory',
        };

        const categories = await this.loadData('categories', searchParams);
        categories.forEach(category => {
            category.subcategories.forEach(subcategory => {
                resultString += `<option value="${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`
            });
        });
        return resultString;
    }

    getPhoto() {
        let resultString = '';
        const arr = Array.from(this.data.images);

        arr.forEach((image, index) => {
            resultString += this.getSinglePhotoTemplate(arr[index].source, arr[index].url);
        });
        return resultString;
    }

    remove() {
        this.elem.remove();
    }

    destroy() {
        this.remove();
        this.element = null;
        this.subElements = null;
    }
}

class ImageUploader {
    async upload(file) {
      const formData = new FormData();
  
      formData.append('image', file);
  
      try {
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
          },
          body: formData,
          referrer: ''
        });
  
        return await response.json();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }