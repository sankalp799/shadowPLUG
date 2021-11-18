const canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

let mouse = {
    x: 0,
    y: 0,
    r: 100,
};

const updateMouseCoords = async (evt) => {
    mouse.x = evt.x;
    mouse.y = evt.y;
};

canvas.addEventListener('mousemove', updateMouseCoords);


class canvasAnimation{
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.lineWidth = 1;
        this._FPS = 1000/60;
        this.cells = 8;
        this.r = 0;
        this.r_u = 0.05;
        this.timer = 0;
        this.lastTime = 0;
        this.gradient;
        this.#Gradient();
        this.#ctx.strokeStyle = this.gradient;
        console.log('BACKGROUND> Init');
    }

    #show(x, y, angle){
        /*
        let posX = x;
        let posY = y;
        let dX = mouse.x - posX;
        let dY = mouse.y - posY;
        let dis = dX * dX + dY * dY;
        let len = dis/10000;
        */
       let len = 10;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        // this.#ctx.lineTo(x + 20, y + 15);
        this.#ctx.lineTo(x+Math.cos(angle)*len, y+Math.sin(angle)*len);
        this.#ctx.stroke();
    }

    #update(){
        this.r += this.r_u;
    }

    #Gradient(){
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop('0.1', '#ff5c33');
        this.gradient.addColorStop('0.3', '#ff66b3');
        this.gradient.addColorStop('0.4', '#ccccff');
        this.gradient.addColorStop('0.6', '#b3ffff');
        this.gradient.addColorStop('0.7', '#80ff80');
        this.gradient.addColorStop('0.9', '#ffff33');
        
    }

    animate(timeStamp){
            let diffTime = timeStamp - this.lastTime;
            this.lastTime = timeStamp;

            if(this.timer > this._FPS){
                this.#ctx.clearRect(0, 0, this.#width, this.#height);
                this.r += this.r_u
                for(let y=0; y<this.#height; y+=this.cells){
                    for(let x=0; x<this.#width; x+=this.cells){
                        let angle = (Math.cos(x*0.01) + Math.sin(y*0.01)) * this.r;
                        this.#show(x, y, angle);
                    }
                }
                this.timer = 0;
            }else{
                this.timer += diffTime;
            }
            

        
        requestAnimationFrame(this.animate.bind(this));
    }
}

(() => {
    canvas.parentElement.addEventListener('resize', (evt) => {        
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offssetHeight;
    });
    const ca = new canvasAnimation(context, canvas.width, canvas.height);
    ca.animate(0);
})();