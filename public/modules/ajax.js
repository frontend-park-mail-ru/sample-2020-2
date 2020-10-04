(function() {
    const noop = () => {};

    class AjaxModule {
        ajaxGet = (ajaxArgs) => {
            this.#ajax({method: 'GET', ...ajaxArgs});
        }

        ajaxPost = (ajaxArgs) => {
            this.#ajax({method: 'POST', ...ajaxArgs});
        }

        ajaxGetPromisified = (ajaxArgs) => {
            return new Promise((resolve, reject) => {
                this.#ajax({
                    ...ajaxArgs,
                    callback(status, responseText) {
                        if (status < 300) {
                            resolve({status, responseText});
                            return;
                        }

                        reject({status, responseText});
                    },
                })
            });
        }

        ajaxGetUsingFetch = async (ajaxArgs) => {
            const response = await fetch(ajaxArgs.url, {
                method: 'GET',
            });
            const parsedJsonObject = await response.json();

            return {
                status: response.statusCode,
                responseObject: parsedJsonObject,
            };
        }

        #ajax({
             method = 'GET',
             url = '/',
             body = null,
             callback = noop
         } = {}) {
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
    }

    globalThis.AjaxModule = new AjaxModule();
})()

