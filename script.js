var songlist;
var MXNT;

const refsongmenu = document.getElementById("refsong");
const querysongmenu = document.getElementById("querysong");
const availsonglist = document.getElementById("availableSongList");

initializeSongs()

async function initializeSongs() {
  await fetch('./songlist.json')
    .then(response => response.json())
    .then(data => songlist = data)
    .catch(err => console.log(err));

  var songOptions = [];
  songlist.map(function(song,i){
      songOptions = document.createElement('option');
      songOptions.textContent = song.name + '-' + song.artist;
      songOptions.value = i;
      refsongmenu.appendChild(songOptions);
      querysongmenu.appendChild(songOptions.cloneNode(true));
    }
  );
}

function referenceSelected() {
  const maxnoteindicator = document.getElementById("maxnoteindicate");
  const targetselectui = document.getElementById("querySelect");
  const availSongui = document.getElementById("availableSongs");
  var refsong = songlist[refsongmenu.value];
  var refdifficulty = document.getElementById("refdifficulty").value

  MXNT = refsong.maxnote + difficultyCorrection(refdifficulty);

  document.getElementById("yourmaxnote").innerHTML = note2text(MXNT);
  document.getElementById("refprelyrics").innerHTML = refsong.maxlyrics[0];
  document.getElementById("refmaxlyrics").innerHTML = refsong.maxlyrics[1];
  document.getElementById("refpostlyrics").innerHTML = refsong.maxlyrics[2];

  maxnoteindicator.hidden = false;
  targetselectui.hidden = false;
  availSongui.hidden = false;
};

var songDOM = [];
function updateAvailableSongs(){
  songDOM.map(dom => dom.remove());
  songlist.map(
    function(song,i){
      if(MXNT > song.maxnote){
        songDOM[i] = document.createElement('li');
        songDOM[i].textContent = songlist[i].name + '-' + songlist[i].artist;
        availsonglist.appendChild(songDOM[i]);
      }
    }
  );
}

function querySongSelected(){
  var querysong = songlist[querysongmenu.value];
  var querydifficulty = document.getElementById("querydifficulty").value;

  if (querysong === undefined){
    return;
  }

  [dkey, key] = querynote(querysong,querydifficulty);

  document.getElementById("querykey").innerHTML = (dkey<0?"":"+") + dkey +'키 (' + note2comptext(key) + ')';
  document.getElementById("queryprelyrics").innerHTML = querysong.maxlyrics[0];
  document.getElementById("querymaxlyrics").innerHTML = querysong.maxlyrics[1];
  document.getElementById("querypostlyrics").innerHTML = querysong.maxlyrics[2];
}


function querynote(song,difficulty){
  mxnt = MXNT - difficultyCorrection(difficulty);
  return [mxnt - song.maxnote, mxnt - song.root];
}

function difficultyCorrection(difficulty){
  switch (difficulty){
    case 'easy' :
      return 3;
      break;
    case 'normal' :
      return 2;
      break;
    case 'hard' :
      return 0;
      break;
  }
}

function note2text(note) {
  //0 is C4
  var key = note % 12;
  if (key<0) {key += 12};

  var octave = Math.floor(note / 12);
  const keylist = ['C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
  ];
  const keylistkor = ['도',
    '도#',
    '레',
    '레#',
    '미',
    '파',
    '파#',
    '솔',
    '솔#',
    '라',
    '라#',
    '시'
  ];
  return keylist[key] + ' (' + (octave + 2) + '옥 ' + keylistkor[key] + ')';
}

function note2comptext(note) {
  //0 is C4
  var key = note % 12;
  if (key<0) {key += 12};
  const keylist = ['C',
    'C# (D♭)',
    'D',
    'D# (E♭)',
    'E',
    'F',
    'F# (G♭)',
    'G',
    'G# (A♭)',
    'A',
    'A# (B♭)',
    'B'
  ];
  return keylist[key];
}
