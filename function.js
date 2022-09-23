function selectFile() { 
  alert('1'); 
}

function saveAsHex() { 
  var filename = document.getElementById('fname').value;
  var hex = hexData.buffer;
  var c = document.createElement('a');
  c.download = filename + '.hex';

  var t = new Blob([hex], {type: 'application/octet-stream'});
  c.href = window.URL.createObjectURL(t);
  c.click(); 
} 

function saveAsText() { alert('2'); 
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
