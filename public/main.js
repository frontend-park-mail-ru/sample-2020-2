console.log('topkek');

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

function ajax(method, url, body = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();
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

        ajax(
            'POST',
            '/login',
            {email, password},
            (status, response) => {
                if (status === 200) {
                    profilePage();
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            }
        )

    });


    application.appendChild(form);
}

function profilePage() {
    application.innerHTML = '';

    ajax('GET', '/me', null, (status, responseText) => {
       let isAuthorized = false;

       if (status === 200) {
           isAuthorized = true;
       }

       if (status === 401) {
           isAuthorized = false;
       }


       if (isAuthorized) {
           const responseBody = JSON.parse(responseText);

           const span = document.createElement('span');
           span.textContent = `Мне ${responseBody.age} и я крутой на ${responseBody.score} очков`;
           application.appendChild(span);

           const back = document.createElement('a');
           back.href = '/menu';
           back.textContent = 'Назад';
           back.dataset.section = 'menu';

           application.appendChild(back);

           const {images} = responseBody;

           if (images && Array.isArray(images)) {
               const div = document.createElement('div');
               application.appendChild(div);

               images.forEach((imageSrc) => {
                   div.innerHTML += `<img src="${imageSrc}" />`;
               });
           }

           return;
       }

       alert('АХТУНГ, нет авторизации');
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
