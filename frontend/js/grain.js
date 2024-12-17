document.addEventListener("DOMContentLoaded", function() {
    const turbulence = document.querySelector("#grainFilter feTurbulence");
    let seedValue = Math.floor(Math.random() * 10);

    function updateGrain() {
        seedValue += Math.floor(Math.random() * 20);
        turbulence.setAttribute("seed", seedValue);
    }

    setInterval(updateGrain, 50);
});