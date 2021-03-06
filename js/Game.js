/* Treehouse FSJS Techdegree
 * Project 4 - OOP Game App
 * Game.js */

 class Game {


     constructor() {
        
         this.missed = 0; // store the missed matches
         this.phrases = this.createPhrases(); //store all arrays in object
         this.activePhrase = null; // the currently playes phrase
         // this is for extras @this.level is a current level stage and @hint is a current hint
         this.level = 1; // current level - increase 
         this.hint = setHint; //left hint - decrease
         this.credit = 0;
     }


    createPhrases() {

        const phrases = [];
        
        //loop over the data array and push it to the phrases array
        for(let i=0, len=data.length; i<len; i++){
           
            for(let j=0, len2=data[i][1].length; j<len2; j++) {
               
              // console.log(`phrase: ${data[i][1][j] }` )
              // console.log(`region: ${data[i][0]}`)
                    // for (let phrase of data[i]) {
                        
                         const listed = new Phrase(data[i][1][j], data[i][0][0]);
                         phrases.push(listed)
                    // } 
               
                
            }
            
        }
        

        // return class object of Phrases
        return phrases;
       
    }
    

    /**
     * startGame method start the game. this functio has passed to  the eventListener in app.js
     *
     * 
     * @return - no return anything
     *
     */
    startGame() {
        lastPhrase = []; // set last phrase to empty array t get next phrase
        console.log(`startgame: ${lastPhrase}`)
        overlay.style.display = 'none'; //set overlay div to display none when the game start

        localStorage.setItem('credit', this.credit);


        let time = startingTime + decreaseTime - (this.level * decreaseTime); //sum the current level and get the decrease time after each level
        game.countDown(time); // call function with summed time
       
        hint.textContent = `Hint ${this.hint}`; //set the hint button to the current hint number
        
        let randomKruh = this.getRandomPhrase(data.length);
        
        //this.interval(9)
        

        if(randomPhrase) {
            this.activePhrase = this.phrases[this.getRandomPhrase(this.phrases.length)]; //get random phrases and store it to the activePhrase
            lastPhrase.push(this.activePhrase.phrase);   
        } else {
            
            let randomNumber = this.getRandomPhrase(allPhrase[0].length);
           // console.log(allPhrase[0][0])
            //console.log(randomNumber);
            console.log(allPhrase[0])
            this.activePhrase = allPhrase[0][randomNumber]; //get random phrases and store it to the activePhrase
            lastPhrase.push(this.activePhrase.phrase);  
            //console.log(this.activePhrase)
            allPhrase[0].splice(randomNumber, 1);
            
            
        }   
         
        this.activePhrase.addPhraseToDisplay(); //call function from Phrase class and dislpay the random phrase
        const help = Math.floor((maxLevel/100) * percent);
        if(this.level <= help) {
            let clouser = this;
            setTimeout(function() {
               const timer = setInterval(function() {
                    clouser.hintFW(true);
                    setTimeout(function() {
                        clearInterval(timer);
                    }, clouser.getRandomPhrase(699))
                    
                }, 200)
                
            }, 200)
            
        }

       
        
    } 

    /**
     * getRandomPhrase method give random number betwen specified number
     *
     * @param {number} number
     * @return {number} - Random number
     */
    getRandomPhrase(number) {
        let random = Math.floor(Math.random() * number);
        return random;
    }

    
    /**
     * handleInteraction method interact with the keyboard - disable
     * and check if all letter has been checked if yes call gameOver function
     * 
     *
     * @param {string} letter - set the choosed letter to disabled and add class name
     * @return - no return anything
     */
    handleInteraction(letter, keyboard) {
        
        
        let disableLetter = false;



        /*loop over all key and check iff any button textcontetn matches with paramater if yes set the button to disabled
        * 
        */
        for(let i = 0; button.length > i; i++) {
            let buttonValue = button[i].textContent;
         
            if(letter == buttonValue) {
              
                button[i].disabled = true; 

            } 
           
           //then add className, call showMatchedLetter() tho show mathcedLetters and check if all letter has been founded
           if(letter == buttonValue && this.activePhrase.checkLetter(letter)) {
                button[i].classList.add('chosen');
                this.activePhrase.showMatchedLetter(letter);

                if(this.checkForWin()){ 

                    let game = 'win';
                    this.gameOver(game);   
            
                }
            
            } 
          
            //if paramehter not match with letters in phrase set class name to 'wrong' and call removelife function
            if(letter == buttonValue && !this.activePhrase.checkLetter(letter)) {
                //if key board is true push choosed letters in array and return true in 'disableLetter' if has been choosed
                if(keyboard) {  

                    disableLetter = choosedLetter.includes(letter)
                
                    choosedLetter.push(letter);
                }
                
                button[i].classList.add('wrong');

                //if true not remove the life
                if(!disableLetter) {
                    this.removeLife();
                }
                
            }
        }

    }

    /**
     * removeLife() method change the img src and increase the this.missed 
     *
     */
    removeLife() {
        let li = document.querySelectorAll('#scoreboard > ol > li');
        
        // loop over all li element and get the img elements in li element
        for(let i = 0; li.length > i; i++) {
             li[this.missed].firstElementChild.src = 'images/lostHeart.png';
        }
        
        this.missed++; 

        //if this.missed equal with 5 than call the gameOver method
        if(this.missed == 5) {
             let game = 'lose';
             this.gameOver(game);  
        }
    }

    /**
     * checkForWin() remove all spaces in word and check if win
     *
     * @return (boolean)
     */
    checkForWin() {
        const correct = document.querySelectorAll('.show');

        let pharseNoSpace = this.activePhrase.phrase.replace(/\s/g, ''); // remove all space from phrase and get the correct length of the phrase
        
        //check if pharse length is same than the all "show" class lenght end if level is equal to 10 if yes return true

        if(pharseNoSpace.length === correct.length || this.level === maxLevel){

            return true;
        } else {
            return false;
        }
       

    }

    /**
     * gameOver method determine if any wins or loses in game
     *
     * @param {string} game - this paramater accept 'win', 'lose' or 'timeover' strings
     *
     */
    gameOver(game) {
        overlay.style.display = 'block'; //set the overlay to display block
        overlay.classList.remove('start');  // remove class 'start'

        // this conditionals check if paramater has any accepted strings
        if(game === 'win') {
            overlay.classList.add('win');
            message.innerHTML = `${this.level} - ${maxLevel - 1} Level <br><br>
            <h1 style="padding: 10px; border: 2px solid gray; background-color: white; color: gray; border-radius: 10px;"> ${lastPhrase[0]}</h1>`;
            btn_reset.textContent = 'Next';
            this.level++;
            this.credit += 20;
           
            console.log(`game: ${this.level}`)
        }

        //'timeover' string is determine if countDown() method increase all time
        if(game === 'lose' || game === 'timeover') {
            overlay.classList.add('lose')
            message.innerHTML = `Lose. Maybe next time. Level-${this.level} <br><br>
            <h1 style="padding: 10px; border: 2px solid gray; background-color: white; color: gray; border-radius: 10px;">${lastPhrase[0]}</h1>`;
            
            btn_reset.textContent = 'Play again';
            this.hint = setHint;
            this.level = 1;
            if(!randomPhrase) {
                allPhrase = [];
                this.phrases = this.createPhrases();
                allPhrase.push(this.phrases);
            }
            
        }

        //if level equal to 'maxLevel' set hint and level to the started value
        if(this.level === maxLevel) {
            overlay.classList.add('win');
            message.textContent = 'Congratulation you hitted the max level';
            btn_reset.textContent = 'Play again';
            this.hint = setHint;
            this.level = 1;
            if(!randomPhrase) {
                allPhrase = [];
                this.phrases = this.createPhrases();
                allPhrase.push(this.phrases);
            }
        }
        
    }

    /**
     * countDown method count down the setted number add h2 element
     * and decrease number every second with setInterval method
     *
     * @param {number} time - specified number what workd like timer
     * @return {number} - return the decreased number every second
     */
    countDown(time) {
        let timeDown = time + 1;
        let game = 'timeover';
        let closure = this;

        const h2 = document.createElement('h2');
        h2.className = 'count';
        h2.textContent = 'Ready? LEVEL ' + this.level;

        
        const timer = setInterval( function() {
            timeDown--; // decrease variable
            if(timeDown <= 10) {
                h2.style.animation = 'blinker 1s linear infinite';
            }
            
            h2.innerHTML = `${closure.convertNumberToTime(timeDown)} <span class="level">LEVEL-${closure.level}</span>`;
            
            //if timedown is 0 call gameOver method and clearInterval
            if(!timeDown) {
                clearInterval(timer); 
                closure.gameOver(game);
                banner.removeChild(h2);
                
               
            } else {
                //if win or lose clearInterval end remove h2 element
                if(overlay.className == 'win' || overlay.className == 'lose') {
                    clearInterval(timer); 
                    banner.removeChild(h2);
                     
                 }
            }
            
            return timeDown;

        }, 1000);

        banner.appendChild(h2); //append h2 element to banner div

    }

    /**
     * convertNumberToTime method format the given numbers to the normal minutes and seconds
     *
     * @param {number} number - any numbers
     * @return {string} - formated time to string
     *
     * @example
     *
     *     foo('hello')
     */
    convertNumberToTime(time) {
       
        
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        
        //seconds less than 10 add 0 string before seconds
        if(seconds < 10) {
            seconds = `0${seconds}`;
        }
       
        let corectedTime = `0${minutes}:${seconds}`; //store corrected time
        return corectedTime;
    }

    /**
     * randomRgba method give random number betwen specified number
     *
     * @param {number} number
     * @return {number} - Random number
     */
    randomRgba(number) {
        let random = Math.floor(Math.random() * number);
        return random;
    }
   
   
    /**
     * hintFW() method determine which letter wasnt choosed frome the phrase and gice radnom letter what is was not choosed yet
     *
     * 
     * @return {string} A good string
     *
     *
     */
     hintFW(startlevel) {

       if(this.hint > 0 || startlevel) {
            const show = document.querySelectorAll('.show');
            let choosedLetters = [];
            let activePhraseNoSpace = [];

            //if any class with name 'show' push textcontent in to the array 
            if(show) {
                for(let i = 0; show.length > i; i++) {

                    choosedLetters.push(show[i].textContent);
                    
                }
            }
         //   console.log(choosedLetters);
            //get activePhrase without spaces
            activePhraseNoSpace =  Array.from((this.activePhrase.phrase.replace(/\s/g, '')))
          //  console.log(activePhraseNoSpace)
            //check if any letters not mathces from 'activePhraseNoSpace' content of 'choosedLetters'
            const noChoosedLetters = activePhraseNoSpace
                .filter(item => !choosedLetters
                .includes(item));
           
            //get any random letter what is was not choosed yet
            let randomLetter = noChoosedLetters[[Math.floor(Math.random() * noChoosedLetters.length)]];
            
            //disable 'randomLetter' on virtual keyboard
            for(let i = 0; button.length > i; i++) {
                if(button[i].textContent === randomLetter) {
                    this.handleInteraction(button[i].textContent);
                }
            }

            this.activePhrase.showMatchedLetter(randomLetter); //call method to show which letter has been randomly choosed

            if(!startlevel){
                this.hint--; //decrease the 'hint'
                hint.textContent = `Hint ${this.hint}`; //show the current hint 
            }
           

            //call gameOver function with win if all letter filled
            console.log(`hintF: ${this.level}`)
            // if(this.checkForWin()) {
            //         let game = 'win';
            //         this.gameOver(game);
            // }
       } else {
           hint.classList.add('shake'); // set class to shake
           
           //after 0.25 second remove classname 'shake'
           setTimeout(function() {
                hint.classList.remove('shake');
            }, 200)
       }
        
    }
    
    interval(number){
      //  clearInterval(timer);
        let numberT = 0;
        let clouser = this;
        const timer = setInterval(function() {
           // let random = Math.floor(Math.random() * number);
             //generate end set the  background with random color after each level
             let body = document.querySelector('body');
             
             
             if(numberT <= 380 ){
                numberT++;
                
             } 

             if(numberT > 380) {
                // clearInterval(timer);
                 numberT = 0;
             }
             console.log(numberT)
             body.style.backgroundImage = `linear-gradient(${numberT}deg, rgba(2,0,36,1) 0%, rgba(103,103,103,1) 0%, rgba(235,235,235,0) 100%)`;
             body.style.transition = "2s";
        }, 50)
    }
    
 }



