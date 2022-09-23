function selectFile() { 
  alert('1'); 
}

function saveAsHex() { // alert('1'); 
  var filename = document.getElementById('fname').value; 
  var hexBuf = new ArrayBuffer(1*2*16); 
  var hexView = new Uint8Array(hexBuf); 
  for(let i=0; i<1*2*16; i++) { 
    hexView[i] = byteView[i]; 
  }
  var c = document.createElement('a');
  c.download = filename + '.hex';

  var t = new Blob([hexBuf], {type: 'application/octet-stream'});
  c.href = window.URL.createObjectURL(t);
  c.click(); 
} 

function saveAsText() { 
  var filename = document.getElementById('fname').value; 
  var text = ''; 
  for(let i=0; i<1*2*16; i++) { 
    var bh = byteView[i].toString(16).toUpperCase(); 
    bh = bh.length < 2 ? '0'+ bh : bh; 
    text += '0x' + bh + ','; 
  } 
  var c = document.createElement('a');
  c.download = filename + '.txt';

  var t = new Blob([text], {type: 'text/plain'});
  c.href = window.URL.createObjectURL(t);
  c.click(); 
} 

function saveAsRaw() {}

function saveAsImage() {}

function saveAsBase64() {}
