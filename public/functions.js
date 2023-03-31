function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

button = document.getElementById("analyse");
analysed_sentence = document.getElementById("analysed_sentence");
output = document.getElementById("output");
probability = document.getElementById("probability");

button.addEventListener('click', async function ButtonAppearance(){
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...'
});

