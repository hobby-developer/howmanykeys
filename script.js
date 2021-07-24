var songlist;

/*

getJSONP('https://hobby-developer.github.io/howmanykeys/songlist.json',
function(data){
  songlist = data;
});

*/


fetch('./songlist.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(error));

var MXNT;
function referenceSelected() {
  var maxnoteindicator = document.getElementById("maxnoteindicate");
  var targetselectui = document.getElementById("targetSelect");
  var refsong = document.getElementById("refname").value;
  var refdifficulty = document.getElementById("refdifficulty").value;

  MXNT = maxnote(refsong, refdifficulty);
  document.getElementById("yourmaxnote").innerHTML = note2text(MXNT);

  maxnoteindicator.hidden = false;
  targetselectui.hidden = false;
};

function targetSongSelected(){
  var refsong = document.getElementById("refname").value;
  var refdifficulty = document.getElementById("refdifficulty").value;
  MXNT
}

function maxnote(song, difficulty) {
  var mxnt;
  switch (song) {
    case 'seosi' :
      mxnt = 9; //A4
      break;
    case 'izi' :
      mxnt = 8; //Ab4
      break;
  };

  switch (difficulty) {
    case 'easy' :
      mxnt += 3;
      break;
    case 'normal' :
      mxnt += 2;
      break;
    case 'hard' :
  };

  return mxnt;
};

function note2text(note) {
  //0 is C4
  var key = note % 12;
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

function getJSONP(url, success) {

    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0]
               || document.documentElement;

    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };

    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);

};
