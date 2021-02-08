export class Stars {
    private static maxWidth = 0;
    private static maxHeight = 0;
    private static stars: Array<Star>;
    private static ctx;

    static randomInt(min) {
        return Math.floor(Math.random() * 255 + min);
    }

    static mousePosition = {
        x: 200, y: 100
    };

    static start(canvas: JQuery) {

        // let canvas = $("<canvas class='cavs'></canvas>");
        // $(dom).append(canvas);
        // var canvas = document.querySelector('canvas'),
        Stars.ctx = canvas.get(0)['getContext']('2d');
        Stars.maxHeight = $(window).height();
        Stars.maxWidth = $(window).width();
        canvas.attr("width", Stars.maxWidth);
        canvas.attr("height", Stars.maxHeight);
        Stars.ctx.lineWidth = 0.3;
        Stars.ctx.strokeStyle = RandomColor.genRandomColor(150);


        Stars.stars = Stars.createStars(Stars.maxWidth, Stars.maxHeight);
        requestAnimationFrame(Stars.animateDots);
    }

    static positionChanged(x, y) {
        Stars.mousePosition.x = x;
        Stars.mousePosition.y = y;
    }

    static mixComponents(comp1, weight1, comp2, weight2) {
        return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    }

    static averageColorStyles(star1: Star, star2: Star) {

        let r = Stars.mixComponents(star1.getColor().getR(), star1.getRadius(), star2.getColor().getR(), star2.getRadius()),
            g = Stars.mixComponents(star1.getColor().getG(), star1.getRadius(), star2.getColor().getG(), star2.getRadius()),
            b = Stars.mixComponents(star1.getColor().getB(), star1.getRadius(), star2.getColor().getB(), star2.getRadius());
        return 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ', 0.7)';
    }


    static createStars(maxWidth, maxHeight): Array<Star> {
        let lstStar: Array<Star> = new Array<Star>();
        for (let i = 0; i < Star.count; i++) {
            lstStar.push(new Star(maxWidth, maxHeight));
        }
        return lstStar;
    }

    static moveDots(stars: Array<Star>) {
        for (let star of stars) {
            star.move();
        }
    }

    static connectDots(stars: Array<Star>) {
        for (let i = 0; i < stars.length; i++) {
            for (let j = 0; j < stars.length; j++) {
                let iStar = stars[i];
                let jStar = stars[j];
                iStar.connectLine(jStar, Stars.mousePosition, Stars.ctx);
            }
        }
    }

    static drawDots(stars: Array<Star>, ctx) {
        for (let i = 0; i < stars.length; i++) {
            stars[i].draw(ctx);
        }
    }

    static animateDots() {
        Stars.ctx.clearRect(0, 0, Stars.maxWidth, Stars.maxHeight);
        Stars.moveDots(Stars.stars);
        Stars.connectDots(Stars.stars);
        Stars.drawDots(Stars.stars, Stars.ctx);

        requestAnimationFrame(Stars.animateDots);
    }

    static destroy() {
        Stars.stars = null;
        Stars.ctx = null;
    }


}

class Star {
    static count = 250;
    static distance = 100;
    static d_radius = 150;
    private x: number;
    private y: number;
    private dx: number;
    private dy: number;
    private radius: number;
    private color: RandomColor;


    constructor(private maxWidth: number, private maxHeight: number) {
        this.x = Math.random() * maxWidth;
        this.y = Math.random() * maxHeight;

        this.dx = -.5 + Math.random();
        this.dy = -.5 + Math.random();
        this.radius = Math.random() * 2;
        this.color = RandomColor.genRandomColor(0);
    }

    move() {
        if (this.y < 0 || this.y > this.maxWidth) {
            this.dx = this.dx;
            this.dy = -this.dy;
        } else if (this.x < 0 || this.x > this.maxHeight) {
            this.dx = -this.dx;
            this.dy = this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }

    getColor() {
        return this.color;
    }

    connectLine(toStar: Star, mousePosition, ctx) {
        if ((this.x - toStar.x) < Star.distance && (this.y - toStar.y) < Star.distance
            && (this.x - toStar.x) > -Star.distance && (this.y - toStar.y) > -Star.distance) {
            if ((this.x - mousePosition.x) < Star.d_radius && (this.y - mousePosition.y) < Star.d_radius
                && (this.x - mousePosition.x) > -Star.d_radius && (this.y - mousePosition.y) > -Star.d_radius) {
                ctx.beginPath();
                ctx.strokeStyle = Stars.averageColorStyles(this, toStar);
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(toStar.x, toStar.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getRadius() {
        return this.radius;
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color.getColorString();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI, false);
        ctx.fill();
    }
}


class RandomColor {
    private r: number;
    private g: number;
    private b: number;

    static genRandomColor(min: number) {

        min = min || 0;
        let color = new RandomColor();
        color.r = Stars.randomInt(min);
        color.g = Stars.randomInt(min);
        color.b = Stars.randomInt(min);
        return color;
    }

    public getR() {
        return this.r;
    }

    public getG() {
        return this.g;
    }

    public getB() {
        return this.b;
    }

    getColorString() {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ', 0.7)';
    }
}
