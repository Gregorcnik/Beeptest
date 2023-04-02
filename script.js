// ============================
// beeptest
// ============================

const lestvice = new Map();
lestvice.set("pentatonika", [-9, -7, -5, -2, 0]);
lestvice.set("celiToni", [-9, -7, -5, -4, -2, 0, 2]);
lestvice.set("kromatika", [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2]);

const pesmi = new Map();
pesmi.set("pi", "31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679");
pesmi.set("korenZDva", "141421356237309504880168872420969807856967187537694807317667973799073247846210703885038753432764157273501384623091229702492483605585073721264412149709993583141322266592750559275579995050115278206057147");
pesmi.set("enaDeljenoSedem", "0142857142857142857142857142857142857142857142857142857142857142857142857142857142857142857142857");
pesmi.set("enaDeljenoEnajst", "0090909090909090909090909090909090909090909");
pesmi.set("enaDeljenoDvanajst", "0083333333333333333333333333333");

const ritmi = new Map();
ritmi.set("ritem1", [1000, 333, 333, 333, 1000, 333, 666]);

let playing = false;

// ====================
// ta prav zacetek

//if you have another AudioContext class use that one, as some browsers have a limit
var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

//All arguments are optional:

//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
};



// Argument: oddaljenost od A4 v poltonih
function toneToHertz (offset) {
  let ret = 440.0;
  if (offset > 0) {
    for (i = 0; i < offset; i++) {
      ret *= 1.059463094;
    }
  } else {
    for (i = 0; i < offset*-1; i++) {
      ret /= 1.059463094;
    }
  }
  return ret;
};

function poLestvici (lestvica, stevilka) {
  let faktor = 1;
  // pogledamo ce smo dobili negativno stevilko
  if (stevilka < 0) {
    // ce je zbrisemo minus ter faktor nastavimo na -1
    stevilka = Math.abs(stevilka);
    faktor = -1;
  }
  // ostanek kaze katei ton v lestvici nas zanima
  let ostanek = stevilka%lestvica.length;
  // pribitek kaze koliko poltonov moramo pristeti
  let pribitek = Math.trunc(stevilka/lestvica.length)*12;

  if (faktor === -1) {
    let zaNegativno = lestvica[0]-(2-lestvica[lestvica.length-1-ostanek]);
    return zaNegativno-pribitek;
  } else {
    return lestvica[ostanek]+pribitek;
  }
}

function callBeep () {
  let duration = document.getElementById("duration");
  let offset = document.getElementById("offset");
  let volume = document.getElementById("volume");
  let type = document.getElementById("type");
  let lestvica = lestvice.get(document.getElementById("lestvica").value);

  beep(duration.value, toneToHertz(poLestvici(lestvica, offset.value)), volume.value, type.value);
};

function callPlaySong () {
  if (!playing) {
    let song = pesmi.get(document.getElementById("pesem").value);
    let lestvica = lestvice.get(document.getElementById("lestvica").value);
    playing = true;
    document.getElementById("abort").style = "visibility: visible;";
    playNotes(song, lestvica, [250], 0);
  } else {
    alert("Nekaj se ze predvaja! 🔊")
  }
};

function abort () {
  playing = false;
  document.getElementById("abort").style = "visibility: hidden;";
};

function playNotes (song, lestvica, ritem, index) {
  // console.log(song, lestvica, ritem, ritem.length, index);
  beep(ritem[index%(ritem.length)], toneToHertz(poLestvici(lestvica, song[index])), document.getElementById("volume").value, document.getElementById("type").value);
  setTimeout (function() {
    if (index < song.length-1 && playing === true) {
      playNotes(song, lestvica, ritem, index+1);
    } else if (index === song.length-1) {
      abort();
    }
  }, ritem[index%ritem.length])
};

// add event listener for enter key
document.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    callBeep();
  }
}.bind(this));
