function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

button = document.getElementById("analyse");
output = document.getElementById("output");
probability = document.getElementById("probability");

button.addEventListener('click', async function ButtonAppearance(){
    //retrieve input
    //sentence = document.getElementById("sentence").value;
    //modify 
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...'
    //todo - process it
    //console.log(sentence);
    //await sleep(3000);
    //button.innerHTML = 'Analyse'
    //output.innerHTML = 'Positive'
    //c = Math.floor(Math.random() * 101);
    //probability.innerHTML = String(c) + ' %'
});

