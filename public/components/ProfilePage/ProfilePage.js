import {imgsFromImagesURLs} from '../../utils/images.js';

export const RENDER_METHOD = {
    DOM: 'dom',
    STRING: 'string',
}

export class ProfilePage {
    #parent
    #data

    constructor(parent) {
        this.#parent = parent;
        this.#data = {};
    }

    get data() {
        return this.#data;
    }

    set data(data) {
        this.#data = data;
    }

    #renderDOM = () => {
        const {age, score, images} = this.data;
        const span = document.createElement('span');
        span.textContent = `Мне ${age} и я крутой на ${score} очков`;
        span.classList.add('profile__text');
        this.#parent.appendChild(span);

        const back = document.createElement('a');
        back.href = '/menu';
        back.textContent = 'Назад';
        back.dataset.section = 'menu';

        this.#parent.appendChild(back);

        if (images && Array.isArray(images)) {
            const div = document.createElement('div');
            this.#parent.appendChild(div);

            images.forEach((imageSrc) => {
                div.innerHTML += `<img src="${imageSrc}" />`;
            });
        }
    }

    #renderString = () => {
        const {age, score, images} = this.data;

        const element = document.createElement('div');
        element.innerHTML = `
            <span class="profile__text">Мне ${age} и я крутой на ${score} очков</span>
            <a href="/menu" data-section="menu">Назад</a>
            ${images && Array.isArray(images) && imgsFromImagesURLs(images)}
        `;
        this.#parent.appendChild(element);
    }

    render(renderMethod = RENDER_METHOD.DOM) {
        switch (renderMethod) {
            case RENDER_METHOD.STRING:
                this.#renderString();
                break;
            case RENDER_METHOD.DOM:
            default:
                this.#renderDOM();

        }
    }
}
