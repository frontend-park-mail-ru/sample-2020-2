import {ProfilePage, RENDER_METHOD} from './components/ProfilePage/ProfilePage.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', {scope: '/'})
        .then((registration) => {
            console.log('sw registration on scope:', registration.scope);
        })
        .catch((err) => {
            console.error(err);
        });
}

const {ajaxGet, ajaxPost, ajaxGetPromisified, ajaxGetUsingFetch} = globalThis.AjaxModule;

const application = document.getElementById('app');

const config = {
    menu: {
        href: '/menu',
        text: 'Главная',
        open: menuPage,
    },
    signup: {
        href: '/signup',
        text: 'Зарегистрироваться',
        open: signupPage,
    },
    login: {
        href: '/login',
        text: 'Авторизоваться',
        open: loginPage,
    },
    profile: {
        href: '/profile',
        text: 'Профиль',
        open: profilePage,
    },
    about: {
        href: '/about',
        text: 'Контакты',
    },
};

function menuPage() {
    application.innerHTML = '';

    Object
        .keys(config)
        .map((menuKey) => {
            const {href, text} = config[menuKey];

            const menuItem = document.createElement('a');
            menuItem.href = href;
            menuItem.textContent = text;
            menuItem.dataset.section = menuKey;

            return menuItem;
        })
        .forEach((element) => {
            application.appendChild(element);
        })
    ;
}

function signupPage() {
    application.innerHTML = '';

    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');
    const ageInput = createInput('number', 'Возраст', 'age');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться!';

    const back = document.createElement('a');
    back.href = '/menu';
    back.textContent = 'Назад';
    back.dataset.section = 'menu';

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(ageInput);
    form.appendChild(submitBtn);
    form.appendChild(back);

    application.appendChild(form);

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const age = +ageInput.value;

        ajaxPost({
            url: '/signup',
            body: {email, password, age},
            callback: (status, response) => {
                if (status === 201) {
                    profilePage();
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            }
        })
    });
}

function loginPage() {
    application.innerHTML = '';
    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Авторизироваться!';

    const back = document.createElement('a');
    back.href = '/menu';
    back.textContent = 'Назад';
    back.dataset.section = 'menu';

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(back);

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        ajaxPost({
            url: '/login',
            body: {email, password},
            callback: (status, response) => {
                if (status === 200) {
                    profilePage();
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            }
        })
    });


    application.appendChild(form);
}

function profilePage() {
    application.innerHTML = '';

    ajaxGetUsingFetch({url: '/me', body: null})
        .then(({statusCode, responseObject}) => {
            const profile = new ProfilePage(application);
            profile.data = responseObject;
            profile.render(RENDER_METHOD.STRING);
        })
        .catch((err) => {
            if (err instanceof Error) {
                // handle JSON.parse error
            }
            const {statusCode, responseObject} = err;
            alert(`АХТУНГ, нет авторизации ${JSON.stringify({status, responseObject})}`);
            loginPage();
        });
}

function createInput(type, text, name) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text;

    return input;
}

application.addEventListener('click', (evt) => {
   const {target} = evt;

   if (target instanceof HTMLAnchorElement) {
       evt.preventDefault();
       config[target.dataset.section].open();
   }
});

menuPage();
