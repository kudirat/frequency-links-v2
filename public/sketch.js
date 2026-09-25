let socket = io();

//target slider
let slider = document.querySelector('#rotation-slider')

//listen for slider input and do something with the input
slider.addEventListener("input", function (e) {
  socket.emit("rotation", this.value);
});

socket.on('rotationResponse', (data) => {
    //transform = "rotate(90deg)"
    document.querySelector("#square").style.transform = `rotate(${data}deg)`
    console.log(("someone changed the rotation to " + data));
});