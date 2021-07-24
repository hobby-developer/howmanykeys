var songlist;
var MXNT;

const refsongmenu = document.getElementById("refsong");
const querysongmenu = document.getElementById("querysong");

initializeSongs()

async function initializeSongs() {
  await fetch('./songlist.json')
    .then(response => response.json())
    .then(data => songlist = data)
    .catch(err => console.log(err));

  var songOptions = [];
  for (let i = 0; i < songlist.length; i++) {
    songOptions[i] = document.createElement('option');
    songOptions[i].textContent = songlist[i].name + '-' + songlist[i].artist;
    songOptions[i].value = i;
    refsongmenu.append(songOptions[i]);
    querysongmenu.append(songOptions[i].cloneNode(true));
  }
  return songOptions;
}

function referenceSelected() {
  const maxnoteindicator = document.getElementById("maxnoteindicate");
  const targetselectui = document.getElementById("querySelect");
  var refsongid = refsongmenu.value;
  var refdifficulty = document.getElementById("refdifficulty").value;

  MXNT = maxnote(refsongid, refdifficulty);

  document.getElementById("yourmaxnote").innerHTML = note2text(MXNT);

  maxnoteindicator.hidden = false;
  targetselectui.hidden = false;
};

function querySongSelected(){
  var querysongid = querysongmenu.value;
  var querydifficulty = document.getElementById("querydifficulty").value;

  [dkey, key] = querynote(querysongid,querydifficulty);

  document.getElementById("querykey").innerHTML = dkey +'키 (' + note2comptext(key) + ')';
}

function maxnote(songid, difficulty) {
  var mxnt;
  mxnt = songlist[songid].maxnote + difficultyCorrection(difficulty);

  return mxnt;
};

function querynote(songid,difficulty){
  mxnt = MXNT - difficultyCorrection(difficulty);
  return [mxnt - songlist[songid].maxnote, mxnt - songlist[songid].root];
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
