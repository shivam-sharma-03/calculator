let string = "";
let buttons = document.querySelectorAll('.button');
let mute_unmute = document.getElementById("mute");
let backspace = document.getElementById("backspace");
const audio = new Audio('../assets/keyPressClick.mp3');

var play = true;
var count = 1;
let history = '';
let isEqual = false;
let memory = 0; // Initialize memory

document.querySelector("#mute").addEventListener('click', function () {
    if (count % 2) {
        play = false;
        mute_unmute.textContent = "🔇";
    } else {
        play = true;
        mute_unmute.textContent = "🔈";
    }
    count++;
});

backspace.addEventListener('click', function () {
    string = string.substring(0, string.length - 1);
    input.value = string;
});

Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (e) => {
        if (play) {
            audio.play();
        }

        if (e.target.innerHTML == '=') {
            string = eval(string);
            input.value = string;
            addToHistory('=');
        } else if (e.target.innerHTML == 'C') {
            addToHistory('C');
            string = '';
            string = string.replace("⌫", "");
            input.value = string;
        } else if (e.target.innerHTML == 'M+') {
            addToHistory('M+');
            memory += parseFloat(string);
            string = '';
            input.value = string;
        } else if (e.target.innerHTML == 'M-') {
            addToHistory('M-');
            memory -= parseFloat(string);
            string = '';
            input.value = string;
        } else {
            string = string + e.target.innerHTML;
            if (isEqual) {
                addToHistory(string);
                isEqual = false;
            } else {
                addToHistory(e.target.innerHTML);
            }
            console.log(string)
            string = string.replace("⌫", "");
            input.value = string;
        }
        if (history == '') {
            document.getElementById('tagHistory').style.display = "none";
        } else {
            document.getElementById('tagHistory').style.display = "block";
        }
    });
});

var regex = new RegExp("^[0-9-/()%*+M]"); // Adjusted the regex pattern

input.addEventListener('input', function (e) {
    if (this.checkValidity()) {
        string = this.value;
    } else {
        this.value = string;
    }
});

body.addEventListener('keyup',
    function (e) {
        const inputValue = input.value;
        if (e.key == 'Backspace' && inputValue.length > 0) {
            history = history.slice(0, -1);
            addToHistory('');
        }
        if (e.key == "Enter") {
            isEqual = true;
            if (play) {
                audio.play();
            }
            string = eval(input.value);
            input.value = string;
            addToHistory("=" + string + '\n');
        } else if (e.key == "Delete") {
            history = '';
            addToHistory('');
            if (play) {
                audio.play();
            }
            string = '';
            input.value = string;
        } else if (regex.test(e.key)) {
            if (play) {
                audio.play();
            }
            input.focus();
            var val = input.value;
            input.value = '';
            input.value = val;
            if (isEqual && e.key != 'Backspace') {
                addToHistory(string);
                isEqual = false;
            } else {
                const reg = /[^0-9+\-*%/=]/gi; // Adjusted the regex pattern
                if (!reg.test(e.key)) {
                    addToHistory(e.key);
                }
            }
        }
    }
);

function addToHistory(value) {
  if (value == 'C') {
      history = '';
      input.value = history;
  } else if (value == 'M+') {
      history += 'M+ ';
  } else if (value == 'M-') {
      history += 'M- ';
  } else if (value == '=') {
      history += `=${input.value}\n`;
  } else if (value != '⌫') {
      history += value;
  }

  // Split the history into lines and keep only the last three lines
  const lines = history.trim().split('\n');
  if (lines.length > 3) {
      history = lines.slice(-3).join('\n');
  }

  document.getElementById('history').innerText = history;
}
