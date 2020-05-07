var answer;
var score = 0;
var backgroundImages = [];

function nextQuestion() {

    //random() returns a number between 0 and 1, where 1 is exclusive
    const n1 = Math.floor(Math.random() * 5); 
    const n2 = Math.floor(Math.random() * 6); 
    
    if(n1 > n2) {
        document.getElementById('n1').innerHTML = n1;
        document.getElementById('n2').innerHTML = n2;
        document.getElementById('stub').innerHTML = "+";
        answer = n1 + n2;
    }

    else {
        document.getElementById('n1').innerHTML = n2;
        document.getElementById('n2').innerHTML = n1;
        document.getElementById('stub').innerHTML = "-";
        answer = n2 - n1;
    }

    
}

function checkAnswer() {

    const prediction = predictImage();
    //console.log(`Correct Answer : ${answer} | Predicted Answer : ${prediction}`);
    
    if(prediction == answer) {
        score++;
        console.log(`Correct !! Score : ${score}`);
        if(score <= 6) {
            backgroundImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundImages;
        }
        else {
            alert('Congratulations on Winning!! Watch your garden in full bloom!');
            // reset parameters, so that quiz can start again
            score = 0;
            backgroundImages = [];
            // make the screen empty again, as this time 'backgroundImages' is an empty array
            document.body.style.backgroundImage = backgroundImages;
        }
        
    }
    else {
        if(score != 0) {
            score--;
        }    
        console.log(`Wrong !! Score : ${score}`);
        alert('Oops you have entered an incorrect answer! Please Check and try writing neater!');
        // empty the garden and return what is left
        setTimeout(function () {
            backgroundImages.pop();
            document.body.style.backgroundImage = backgroundImages;
            
        }, 1000);
    }
    
}