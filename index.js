const cities = [
    { id: "1", name: "Київ" },
    { id: "2", name: "Лондон" },
    { id: "3", name: "Париж" },
    { id: "4", name: "Харків" }
];

const languages = [
    { code: "UA", name: "Українська" },
    { code: "UK", name: "Англійська" },
    { code: "FR", name: "Французька" }
];

function submitForm(evt) {
    evt.preventDefault();

    const form = document.getElementById('mainForm');
    const formData = new FormData(form);
    const result = {};

    for (const entry of formData.entries()) {
        const key = entry[0];
        const value = entry[1];

        switch (key) {
            case "sex": {
                result[key] = value == "male" ? "Чоловіча" : "Жіноча";
                break;
            }
            case "city": {
                result[key] = cities.find(c => c.id == value).name;
                break;
            }
            case "languages": {
                result.languages ||= [];
                const lang = languages.find(l => l.code == value);
                result.languages.push(lang.name);
                break;
            }
            default:
                result[key] = value;
        }
    }

    Object.keys(result).forEach(prop => {
        const td = document.getElementById(`td_${prop}`);
        const val = result[prop];

        if (prop !== "languages") {
            td.innerText = val && val.length ? val : " - ";
        } else {
            td.innerText = val.join(', ');
        }
    });

    document.getElementById("form-holder").style.display = "none";
    document.getElementById("form-results").style.display = "block";

    return false;
}

window.onload = () => {
    document.getElementById('mainForm').onsubmit = submitForm;
};