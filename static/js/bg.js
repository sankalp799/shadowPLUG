const canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.parentElement.addEventListener('resize', (evt) => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
});

