const formComponent = `
    <form id="form">
        <input type="text" name="title">
        <input type="file" name="picture">
        <button>Send</button>
    </form>
`

function loadEvent() {
    //meghívjuk a root-it
    const rootElement = document.getElementById("root");

    //beillesztjük a formComponentet
    rootElement.insertAdjacentHTML("beforeend", formComponent);

    //változóba mentjük a form-ot, majd egy submit eseményfigyelőt adunk hozzá
    const formElement = document.getElementById("form");
    formElement.addEventListener("submit", e => {
        e.preventDefault();

        //postázni akarom az adatokat, ehhez ez a doboz hozzá:
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