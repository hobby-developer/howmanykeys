var songlist;
var MXNT;
var refsongform
var refsong;
var querysong;


main();

async function main() {
  await fetchSongs();
  //const refsongform = initializeSongForm('#refSong');
  refsongform = initializeSongForm('#refSong',
    function(selection) {
      refsong = selection;
      referenceSelected();
      updateAvailableSongs();
      querySongSelected();

    });
  const querysongform = initializeSongForm('#querySong',
    function(selection) {
      querysong = selection;
      querySongSelected();
    });
}

async function fetchSongs() {
  await fetch('./songlist.json')
    .then(response => response.json())
    .then(data => songlist = data)
    .catch(err => console.log(err));
  songlist.map(song => song.fullname = song.artist + ' - ' + song.name)
};

function initializeSongForm(selector, selectedCallback) {
  var AC = new autoComplete({
    selector: selector,
    placeHolder: "노래 제목 / 가수 검색",
    data: {
      src: songlist,
      keys: ["fullname"]
    },
    resultItem: {
      highlight: {
        render: true
      }
    },
    submit: true,
    resultsList: {
      element: (list, data) => {
        const requestSongPanel = document.getElementById("requestSong").cloneNode(true);
        if (data.results.length > 0) {
          requestSongPanel.hidden = true;
        } else {
          requestSongPanel.hidden = false;
        }
        list.prepend(requestSongPanel);
      },
      noResults: true,
      maxResults: 65535,
      tabSelect: true,
      threshold: 0
    }
  });

  AC.input.addEventListener("selection", function(event) {
    const feedback = event.detail;
    const selection = feedback.selection.value;
    selectedCallback(selection);
    // Replace Input value with the selected value
    AC.input.value = selection[feedback.selection.key];
  })


  const ACdom = document.querySelector(selector);
  ACdom.onclick = function(){
    AC.start(" ");
  };

  return AC
};

function referenceSelected() {
  const maxnoteindicator = document.getElementById("maxnoteindicate");
  const targetselectui = document.getElementById("querySelect");
  const availSongui = document.getElementById("availableSongs");
  const askdeveloperui = document.getElementById("askdeveloper");
  var refdifficulty = document.getElementById("refdifficulty").value

  MXNT = refsong.maxnote + difficultyCorrection(refdifficulty) - 1; //normal is center

  document.getElementById("yourmaxnote").innerHTML = note2text(MXNT,'kor');
  document.getElementById("refprelyrics").innerHTML = refsong.maxlyrics[0];
  document.getElementById("refmaxlyrics").innerHTML = refsong.maxlyrics[1];
  document.getElementById("refpostlyrics").innerHTML = refsong.maxlyrics[2];

  maxnoteindicator.hidden = false;
  targetselectui.hidden = false;
  availSongui.hidden = false;
  askdeveloperui.hidden = false;
};

var songDOM = [];

function updateAvailableSongs() {
  const availsonglist = document.getElementById("availableSongList");

  songDOM.map(dom => dom.remove());
  songlist.map(
    function(song, i) {
      if (MXNT + song.compensation > song.maxnote) {
        songDOM[i] = document.createElement('ul');
        songDOM[i].textContent = songlist[i].name + '-' + songlist[i].artist;
        availsonglist.appendChild(songDOM[i]);
      }
    }
  );
}

function querySongSelected() {
  var querydifficulty = document.getElementById("querydifficulty").value;
  const compIndicator = document.getElementById("querykeycompensate");

  if (querysong === undefined) {
    return;
  }

  [dkey, key] = querynote(querysong, querydifficulty);
  comp = querysong.compensation;
  if (comp != 0) {
    compIndicator.innerHTML = '고음 빈도가 높아요!' + comp + '키 보정';
    compIndicator.hidden = false;
    dkey += comp;
    key += comp;
  } else {
    compIndicator.hidden = true;
  }

  if (querydifficulty === "hard") {
    compIndicator.style.textDecoration = "line-through";
    dkey -= comp;
    key -= comp;
  } else {
    compIndicator.style.textDecoration = "none";
  }

  document.getElementById("querykey").innerHTML = (dkey < 0 ? "" : "+") + dkey + '키';
  const altui = document.getElementById("queryaltkey");
  if (dkey > 6) {
    altui.innerHTML = "= " + (dkey-12) + "키 (1옥타브 올려서)";
    altui.hidden = false;
  } else if(dkey < -6){
    altui.innerHTML = "= +" + (dkey+12) + "키 (1옥타브 내려서)";
    altui.hidden = false;
  } else {
    altui.hidden = true;
  }
  document.getElementById("queryroot").innerHTML = note2comptext(key);
  document.getElementById("queryprelyrics").innerHTML = querysong.maxlyrics[0];
  document.getElementById("querymaxlyrics").innerHTML = querysong.maxlyrics[1];
  document.getElementById("querypostlyrics").innerHTML = querysong.maxlyrics[2];

  document.getElementById("querynotechange").innerHTML = '원곡 최고음 : '+note2text(querysong.maxnote,'kor')+' → 보정 후 최고음 : '+note2text(querysong.maxnote+dkey,'kor');
}


function querynote(song, difficulty) {
  mxnt = MXNT - difficultyCorrection(difficulty);
  dkey = mxnt - song.maxnote;
  return [dkey, song.root + dkey];
}

function difficultyCorrection(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 2;
      break;
    case 'normal':
      return 1;
      break;
    case 'hard':
      return 0;
      break;
  }
}

function note2text(note,option='all') {
  //0 is C4
  var key = note % 12;
  if (key < 0) {
    key += 12
  };

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
  eng = keylist[key];
  kor = (octave + 2) + '옥 ' + keylistkor[key];
  switch (option){
    case 'eng':
      return eng;
    case 'kor':
      return kor;
    case 'all':
      return eng+' (' +kor+ ')';
  }



}

function note2comptext(note) {
  //0 is C4
  var key = note % 12;
  if (key < 0) {
    key += 12
  };
  const keylist = ['C',
    'C# 또는 D♭',
    'D',
    'D# 또는 E♭',
    'E',
    'F',
    'F# 또는 G♭',
    'G',
    'G# 또는 A♭',
    'A',
    'A# 또는 B♭',
    'B'
  ];
  return keylist[key];
}
