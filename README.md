# saagnikadhikary-digit-recognition

The Project involves a website showing some elementary mathematics questions, whose answer is to be entered(drawn by a mouse, or by a finger(in case of a touch screen)) in the black canvas provided beside it.

The digit recognition model, built using raw tensorflow trained on MNIST dataset, works behind the scenes, to recognise the drawn image on the canvas, similar to the concept of how the model on providing a picture of a digit, tries to predict its value.

This predicted value is then compared with the actual answer to the question presented on the website. If the two match, the foliage starts growing thicker and if the two don’t match, the foliage begins disappearing.

It may involve writing the answer as neatly as possible, in order that the model can recognise the digit correctly. Otherwise if the answer is illegible, the model may return incorrect predictions, even though the user may think he has entered the correct answer, and your garden might not grow!!

Note : 
In case of a touch screen, please try to avoid multiple touches, even when you’re using a single finger to draw the answer, as the canvas is sensitive only to the first touch it receives and might not correctly consider two-point touches used to draw.
You are advised not to draw on the canvas, when the page is in scrolled state, i.e when the right scrollbar isn’t placed all the way up. The canvas involves offsetting wrt the top left corner of the page, which is considered as the origin(0,0). Keeping the page scrolled while drawing, shifts this origin and the drawing isn’t visible in the canvas. Only scroll the page after entering the answer and clicking the “Check Answer” button. Remember to scroll up again, before trying to draw on the cavaas again, in case you had scrolled down previously.

To get the best experience, reset the page zooming to occupy your entire screen, so that scrolling is never required.
