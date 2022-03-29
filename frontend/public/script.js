const formComponent = `
    <form id="form">
        <input type="text" name="title">
        <input type="file" name="picture">
        <button>Send</button>
    </form>
`

function loadEvent() {
    const rootElement = document.getElementById("root");

    //beillesztjuk a formComponentet a rootba
    rootElement.insertAdjacentHTML("beforeend", formComponent);

    //valtozoba mentjuk a form-ot, majd egy submit esemenyfigyelot adunk hozza
    const formElement = document.getElementById("form");
    formElement.addEventListener("submit", e => {
        e.preventDefault();

        //postazni akarom az adatokat, ez a doboz hozza
        const formData = new FormData();
        formData.append("title", e.target.querySelector(`input[name="title"]`).value);
        formData.append("picture", e.target.querySelector(`input[name="picture"]`).files[0]);

        const fetchSettings = {
            method: 'POST',
            body: formData
        };

        fetch("/", fetchSettings)
        .then(async data => {
            if (data.status === 200){
                const res = await data.json()
                e.target.outerHTML = `<img src="upload/${res.pictureName}">`;
                console.dir(data)
            }
        })
        .catch(error => {
            e.target.outerHTML = `Error`;
            console.dir(error);
        })
    })
}

window.addEventListener("load", loadEvent);