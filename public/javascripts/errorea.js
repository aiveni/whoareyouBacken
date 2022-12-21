
window.onload = async function() {
    document.getElementById("bidali").addEventListener("click", function() {
        let izena = document.getElementById("username").value
        let pasahitza = document.getElementById("password").value
        let datuak = { izena: izena, pasahitza: pasahitza }
        let errorea = document.getElementById("login_failed")
        document.getElementById("username").value = ""
        document.getElementById("password").value = ""
            fetch("/user", {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(datuak)
            })
                .then(r => r.text())
                .then(r => {console.log(r)

                    if (r == "ok") {
                        errorea.innerHTML = ""
                        window.location.href = "/main"
                    } else {
                        errorea.innerHTML = "Kredentzialak ez dira zuzenak"
                        errorea.style.color = "red"
                    }
                })

    })
}