function selectFile() { 
  alert('1');  
  var ele = document.createElement('input'); 
  ele.setAttribute('type','file'); 
  ele.setAttribute('id','file'); 
  // ele.setAttribute('onchange','readFile()'); 
  // ele.setAttribute('style','display:none'); 
  ele.addEventListener('change', function () { 
        var file = ele.files[0]; 
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            var text = reader.result; 
            readText(text); 
        }, false);
        if (file) { 
          reader.readAsText(file);
        } 
    } , false); 
    ele.click();
} 

function readText(txt) { 
  var buf = new ArrayBuffer(64); 
  var view = new Uint8Array(buf); 
  var text = ''; 
  for(let i=0; i<32*5; i+=5) {
    text += txt.charAt(i+2)+txt.charAt(i+3);
  } 
  var hexChar = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']; 
  for(let i=0; i<32*2; i++) { 
    for(let j=0; j<16; j++) { 
      if(text.charAt(i) == hexChar[j]) { 
        view[i] = j; break; 
      }
    }
  } 
  for(let i=0; i<32; i++) {
    byteView[i] = (view[2*i+0])*16 + view[2*i+1]; 
  } alert(byteView); 
}

function saveAsHex() { 
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

function saveAsRaw() { 
  var filename = document.getElementById('fname').value; 
  var hexBuf = new ArrayBuffer(32+16*4*16); 
  var hexView = new Uint8Array(hexBuf); 
  for(let i=0; i<32; i++) {
    hexView[i] = 0x00; 
  } hexView[1]=16;  hexView[3]=16;
  for(let i=0; i<16*4*16; i++) { 
    hexView[32+i] = pxlView[i]; 
  }
  var c = document.createElement('a');
  c.download = filename + '.bin';

  var t = new Blob([hexBuf], {type: 'application/octet-stream'});
  c.href = window.URL.createObjectURL(t);
  c.click(); 
}

function saveAsImage() {  
  var c = document.createElement('canvas'); 
  c.setAttribute('id','cnv1') ; 
  c.setAttribute('width','16') ; 
  c.setAttribute('height','16') ; 
  document.body.appendChild(c);
  var cnv = document.getElementById('cnv1'); 
  var ctx = cnv.getContext('2d'); 
  var imgData = ctx.createImageData(16, 16); 
  for(let i=0; i<16*4*16; i++) {
    imgData.data[i] = pxlView[i]; 
  } 
  ctx.putImageData(imgData, 0, 0); 
  
  let filename = document.getElementById('fname').value; 
  let canvasImage = document.getElementById('cnv1').toDataURL('image/png'); 
  c.remove(); 
    
  // this can be used to download any image from webpage to local disk
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename + '.png';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove(); 
    };
    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}

function saveAsBase64() {}
