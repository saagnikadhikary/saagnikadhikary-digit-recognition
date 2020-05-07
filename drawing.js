const BACKGROUND_COLOUR = '#000000';
const LINE_COLOUR = '#FFFFFF';
const LINE_WIDTH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;

function prepareCanvas() {
    canvas = document.getElementById('my-canvas');
    // returns an identifier of the type of canvas to create
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOUR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.strokeStyle = LINE_COLOUR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    var isPainting = false;

    // adding an EventListener to detect mouse down event
    document.addEventListener('mousedown', function (event) {
        isPainting = true;
        currentX = event.clientX - canvas.offsetLeft;
        //currentY = event.clientY - canvas.offsetTop + 167;
        currentY = event.clientY - canvas.offsetTop;
    });

    document.addEventListener('mousemove', function (event) {
        
        // draw only when mouse is pressed (i.e event 'mousedown' occurs)
        if(isPainting){

            previousX = currentX;
            // event.clientX holds the x-coordinate of cursor at the current moment
            /* canavs.offsetLeft returns the left position (in pixels) 
            relative to the left of the offsetParent element(i.e the main page element)
            */ 
            currentX = event.clientX - canvas.offsetLeft;

            previousY = currentY;
            // event.clientY holds the y-coordinate of cursor at the current moment
            /* canavs.offsetTop returns the top position (in pixels) 
            relative to the top of the offsetParent element(i.e the main page element)
            */ 
            //currentY = event.clientY - canvas.offsetTop + 167;
            currentY = event.clientY - canvas.offsetTop;
            //console.log(canvas.offsetLeft);
            //console.log(event.clientX);
            //console.log('X : ' + currentX);
            //console.log('Y : ' + currentY);
            
            draw();

        }

    });

    // adding an EventListener to detect mouse up event
    document.addEventListener('mouseup', function (event) {
        isPainting = false;
    });

    // stop drawing once mouse leaves the canvas, even though mouse may be pressed down
    canvas.addEventListener('mouseleave', function (event) {
        isPainting = false;
    });

    // adding an EventListener to detect touch down event
    canvas.addEventListener('touchstart', function (event) {
        isPainting = true;
        /* 
        the touch events are stored in an array, 
        as there can be touches involving more than one fingers
        unlike in case of a mouse, where there is only a single pointer
         */
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        //currentY = event.touches[0].clientY - canvas.offsetTop + 150;
        currentY = event.touches[0].clientY - canvas.offsetTop;
    });

    // stop drawing once touch leaves the canvas, even though there may be touch outside the canvas
    canvas.addEventListener('touchend', function (event) {
        isPainting = false;
    });

    // adding an EventListener to detect touch up(i.e no touch) event
    canvas.addEventListener('touchcancel', function (event) {
        isPainting = false;
    });

    // adding an EventListener to detect touch move event
    canvas.addEventListener('touchmove', function (event) {
        
        // draw only when mouse is pressed (i.e event 'mousedown' occurs)
        if(isPainting){

            previousX = currentX;
            // event.touches[0].clientX holds the x-coordinate of first finger touch at the current moment
            /* canavs.offsetLeft returns the left position (in pixels) 
            relative to the left of the offsetParent element(i.e the main page element)
            */ 
            currentX = event.touches[0].clientX - canvas.offsetLeft;

            previousY = currentY;
            // event.touches[0].clientY holds the y-coordinate of first finger touch at the current moment
            /* canavs.offsetTop returns the top position (in pixels) 
            relative to the top of the offsetParent element(i.e the main page element)
            */ 
            //currentY = event.touches[0].clientY - canvas.offsetTop + 150;
            currentY = event.touches[0].clientY - canvas.offsetTop;
            //console.log(canvas.offsetLeft);
            //console.log(event.clientX);
            //console.log('X : ' + currentX);
            //console.log('Y : ' + currentY);
            
            draw();

        }

    });
    
}

function draw() {
    // begins a path, or resets the current path, i.e create a list of initial coordinates
    context.beginPath();
    // set the starting point of the line that will be drawn
    context.moveTo(previousX, previousY);
    // set the current point(i.e ending point) of the line that will be drawn
    context.lineTo(currentX, currentY);
    // creates a path from the current point back to the starting point
    context.closePath();
    // actually draw the path you have defined
    context.stroke();
}

function clearCanvas() {
    // reset the coodinates for a new drawing
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0; 
    // make the canvas black again
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

}