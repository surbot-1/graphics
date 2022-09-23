function saveAsHex() {} 

function saveAsText() { alert('1'); 
  var filename = document.getElementById('fname').value;
  var text = textData;
  var c = document.createElement('a');
  c.download = filename + '.txt';

  var t = new Blob([text], {type: 'text/plain'});
  c.href = window.URL.createObjectURL(t);
  c.click(); 
} 

function saveAsRaw() {}

function saveAsImage() {}

function saveAsBase64() {}
