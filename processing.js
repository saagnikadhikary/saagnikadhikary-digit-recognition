var model;

async function loadModel() {
    model = await tf.loadGraphModel('SavedModelTFJS/model.json')
    //console.log(model)
}

function predictImage() {
    // loading the image drawn on the canvas into Opencv
    // 'let' allows variables to have Block Scope(i.e { })
    let image = cv.imread(canvas);
    
    // converting the image to grayscale, having a single colour channel
    /* cvtColor(input, output, color space conversion code, number of channels in the destination image)
    if the parameter is 0, the number of the channels is derived automatically from input and output */
    cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0)
    
    /* make pixels above a certain threshold white and rest black, so that
    edges are more defined */
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);
    
    /* getting the image contours or boundaries */
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    // finding the bounding rectangle, based on the contours obtained above
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    // cropping the image, using the bounding rectangle 
    image = image.roi(rect);

    // image needs to be resized to comply with the dimensions that the model expects
    var height = image.rows;
    var width = image.cols;
    /* the long edge will be 20 pixels long and later we will add 8 pixels padding 
    to make it 28 pixels, same as the model input expects */ 

    // if the image is tall and narrow
    if(height > width) {
        height = 20;
        const scaleFactor = image.rows / height;
        width = Math.round(image.cols / scaleFactor);
    }

    // if the image is short and wide
    else {
        width = 20;
        const scaleFactor = image.cols / width;
        height = Math.round(image.rows / scaleFactor);
    }

    // computing the newsize to which old image will be scaled
    let newSize = new cv.Size(width, height);
    // resizing the image to the newsize created above
    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

    // creating the paddings to make image 28*28, so that it can be fed to the model
    const LEFT = Math.ceil(4 + (20 - width) / 2);
    const RIGHT = Math.floor(4 + (20 - width) / 2);
    const TOP = Math.ceil(4 + (20 - height) / 2);
    const BOTTOM = Math.floor(4 + (20 - height) / 2);
    
    // creating a black scalar to serve as border(or padding)
    const BLACK = new cv.Scalar(0, 0, 0, 255);
    // adding the paddings created above, to the image
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

    // finding the contours to get the centre of mass of the image
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    // getting the moments object, here false means, yhe image dealt with isn't a binary image
    const Moments = cv.moments(cnt, false);

    // storing the x-coordinate of the centre of mass
    const cx = Moments.m10 / Moments.m00;
    // storing the y-coordinate of the centre of mass
    const cy = Moments.m01 / Moments.m00;

    //console.log(`M00 : ${Moments.m00} | cx : ${cx} | cy : ${cy}`);

    // finding the shifts in the x and y direction that is needed to centre the image
    const X_SHIFT = Math.round(image.cols / 2.0 - cx);
    const Y_SHIFT = Math.round(image.rows / 2.0 - cy);
    
    newSize = new cv.Size(Image.cols, Image.rows);
    // creating the transformation matrix, that will shift the image
    /*
    More generally, type name of a Mat object consists of several parts. Here's example for CV_64FC1:
    CV_ - this is just a prefix
    64 - number of bits per base matrix element (e.g. pixel value in grayscale image 
         or single color element in BGR image)
    F - type of the base element. In this case it's F for float, but can also be S (signed) 
        or U (unsigned)
    Cx - number of channels(x) in an image
    */
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);

    // shifting the image using M
    // warpAffine(src, M, outputImageSize[, dst[, flags[, borderMode[, borderValue]]]]) → dst
    cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    // pulling out the raw data from the image
    // pixelValues hold an array of integers from 'image.data'
    let pixelValues = image.data;
    //console.log(`Initial Pixel Values : ${pixelValues}`);

    // converting the array of integer to array of decimal values
    pixelValues = Float32Array.from(pixelValues);

    // normalising the data, as the model is trained on normalised data
    pixelValues = pixelValues.map(function (item) {
        return item / 255.0;
    });
    //console.log(`Normalised Pixel Values : ${pixelValues}`);

    /*
    creating the tensor from the normalised 'pixelvalues' obatained above,
    this created tensor will be fed to the model to predict its value!!
    */
    // a 2d array is to be given, here pixelvalues is already an array and so we enclose it in another
    // pair of square brackets, to make it a 2d array
    const X = tf.tensor([pixelValues]);
    //console.log(`Tensor Shape : ${X.shape}`);
    //console.log(`Tensor Type : ${X.dtype}`);

    // feeding the tensor to the model to obtain the model prediction
    const result = model.predict(X);
    result.print();

    //console.log(tf.memory());

    // the output returned by the tensor is stored and then returned
    // dataSync() provides an array as output, and since only one element in the result array 
    // is obtained, the same value is indexed as dataSync()[0]
    const output = result.dataSync()[0];

    /*
    // testing the loaded image
    const outputCanvas = document.createElement('canvas');
    // printing the loaded image into the above created canvas
    cv.imshow(outputCanvas, image);
    // appending this canvas to the body of the html document
    document.body.appendChild(outputCanvas);
    */

    // Cleanups 
    image.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();
    // free the memory occupied by tensors
    X.dispose();
    result.dispose(); 

    // the output is finally returned
    return output;
}