function selectFile() { 
  var ele = document.createElement('input'); 
  ele.setAttribute('type','file'); 
  ele.setAttribute('id','file'); 
  // ele.setAttribute('onchange','readFile()'); 
  // ele.setAttribute('style','display:none'); 
  ele.addEventListener('change', function () { 
        var file = ele.files[0]; 
        var filename = ele.files[0].name; 
        filename = filename.substring(0,filename.indexOf('.'));
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            var text = reader.result; 
            textToHex(text); 
            putText(filename, text); 
            putKeypad(0,0,0); 
            putImage(); 
        }, false);
        if (file) { 
          reader.readAsText(file);
        } 
    } , false); 
    ele.click();
} 

function textToHex(txt) { 
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
    byteView[i] = view[2*i+0]*16 + view[2*i+1]; 
  } 
  var byte = ['0x80','0x40','0x20','0x10','0x08','0x04','0x02','0x01']; 
  for(let i=0; i<32; i++) {
    for(let j=0; j<8; j++) { 
      var b = byteView[i] & byte[j]; 
      if(b) { 
        pxlView[i*32+j*4+0] = 0x40; //R
        pxlView[i*32+j*4+1] = 0x40; //G
        pxlView[i*32+j*4+2] = 0xFF; //B
        pxlView[i*32+j*4+3] = 0xFF; //A
      } else if(!b) {
        pxlView[i*32+j*4+0] = 0xFF; //R
        pxlView[i*32+j*4+1] = 0xFF; //G
        pxlView[i*32+j*4+2] = 0xFF; //B
        pxlView[i*32+j*4+3] = 0xFF; //A
      }
    }
  } 
  for(let i=0; i<32; i++) {
    for(let j=0; j<8; j++) { 
      var b = byteView[i] & byte[j]; 
      if(b) { 
        for(let k=0; k<60*4*60; k+=4) {
          keyView[i*60*4*60*8+j*60*4*60+k+0] = 0x40; //R
          keyView[i*60*4*60*8+j*60*4*60+k+1] = 0x40; //G
          keyView[i*60*4*60*8+j*60*4*60+k+2] = 0xFF; //B
          keyView[i*60*4*60*8+j*60*4*60+k+3] = 0xFF; //A
        }
      } else if(!b) {
        for(let k=0; k<60*4*60; k+=4) {
          keyView[i*60*4*60*8+j*60*4*60+k+0] = 0xFF; //R
          keyView[i*60*4*60*8+j*60*4*60+k+1] = 0xFF; //G
          keyView[i*60*4*60*8+j*60*4*60+k+2] = 0xFF; //B
          keyView[i*60*4*60*8+j*60*4*60+k+3] = 0xFF; //A
        }
      }
    }
  } 
} 

function putText(fname, txt) {
  document.getElementById('fname').value = fname; 
  document.getElementById('div2').innerHTML = '<br>' + 
    txt.substring(0,40)+'<br>'+txt.substring(40,80)+'<br>'+
    txt.substring(80,120)+'<br>'+txt.substring(120,160); 
}

function putKeypad(x, y, t) {
  var px=0; var py=0; 
  var pw=0; var ph=0; 
  var cl=16; var rw=16; 
  var kc=0; var kr=0; 
  var kl=2; var kt=2; 
  var kw=60; var kh=60; 
  
  var cnv = document.getElementById('canvas'); 
  var ctx = cnv.getContext('2d'); 
  var imgData = ctx.createImageData(kw, kh); 
  
  ctx.fillStyle = 'rgba(192,192,192,1.0)'; // gray 
  ctx.fillRect(x, y, 1024, 1024); 
  
  function draw(kc, kr, kw, kh, kl, kt) { 
    var kx=x+px+(kw+kl*2)*kc; 
    var ky=y+py+(kh+kt*2)*kr; 
    for (let i=0; i<(kw*4*kh); i++) { 
      imgData.data[i] = keyView[kw*4*kh*(cl*kr+kc)+i]; 
    } 
    ctx.putImageData(imgData, kx+kl, ky+kt); 
  } 
  
  for (let j=0; j<rw; j++) { 
    for (let i=0; i<cl; i++) { 
      kc=i; kr=j; 
      draw(kc, kr, kw, kh, kl, kt); 
    } 
  } 
}

function putImage() { 
  var cnv = document.getElementById('canv'); 
  var ctx = cnv.getContext('2d'); 
  var imgData = ctx.createImageData(16, 16); 
  
  for(let i=1; i<=8; i++) { 
    imgData = ctx.createImageData(16*i, 16*i); 
    zoomPixel(16,16,i,i); 
    for(let j=0; j<16*i*4*16*i; j++) { 
      imgData.data[j]=zpxlView[j]; 
    }  
    ctx.putImageData(imgData, 128*(i-1),0); 
  } 
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

function saveAsImagePNG() {  
  var c = document.createElement('canvas'); 
  c.setAttribute('id','ccnv') ; 
  c.setAttribute('width','16') ; 
  c.setAttribute('height','16') ; 
  document.body.appendChild(c);
  var cnv = document.getElementById('ccnv'); 
  var ctx = cnv.getContext('2d'); 
  var imgData = ctx.createImageData(16, 16); 
  for(let i=0; i<16*4*16; i++) {
    imgData.data[i] = pxlView[i]; 
  } 
  ctx.putImageData(imgData, 0, 0); 
  
  let filename = document.getElementById('fname').value; 
  let canvasImage = document.getElementById('ccnv').toDataURL('image/png', 1.0); 
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

function saveAsImageJPEG() {  
  var c = document.createElement('canvas'); 
  c.setAttribute('id','ccnv') ; 
  c.setAttribute('width','16') ; 
  c.setAttribute('height','16') ; 
  document.body.appendChild(c);
  var cnv = document.getElementById('ccnv'); 
  var ctx = cnv.getContext('2d'); 
  var imgData = ctx.createImageData(16, 16); 
  for(let i=0; i<16*4*16; i++) {
    imgData.data[i] = pxlView[i]; 
  } 
  ctx.putImageData(imgData, 0, 0); 
  
  let filename = document.getElementById('fname').value; 
  let canvasImage = document.getElementById('ccnv').toDataURL('image/jpeg', 1.0); 
  c.remove(); 
    
  // this can be used to download any image from webpage to local disk
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = filename + '.jpg';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove(); 
    };
    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}

function saveAsBase64() { 
  var c = document.createElement('canvas'); 
  c.setAttribute('id','ccnv') ; 
  c.setAttribute('width','16') ; 
  c.setAttribute('height','16') ; 
  // document.body.appendChild(c);
  // var cnv = document.getElementById('ccnv'); 
  var ctx = c.getContext('2d'); 
  var imgData = ctx.createImageData(16, 16); 
  for(let i=0; i<16*4*16; i++) {
    imgData.data[i] = pxlView[i]; 
  } 
  // ctx.putImageData(imgData, 0, 0); 
  
  let filename = document.getElementById('fname').value; 
  let cnvImage = c.toDataURL('image/png', 1.0); 
  // c.remove(); alert(cnvImage); 
  var blob = new Blob([cnvImage], {type: 'text/plain'});
  
  var a = document.createElement('a'); 
  a.setAttribute('id','ca'); 
  a.href = window.URL.createObjectURL(xhr.response);
  a.download = filename + '.txt';
  a.style.display = 'none';
  document.body.appendChild(a); 
  a.click();
  a.remove(); 
} 

function zoomPixel2(w,h,a,b) { 
  var bt = 0; var n=4; 
  for (let i=0; i<w*n*a*h*b; i+=w*n*a*b) { 
    for (let j=0; j<w*n*a; j+=n*a) { 
      for (let k=0; k<w*n*a*b; k+=w*n*a) { 
        for (let l=0; l<n*a; l+=n) { 
          zpxlView[i+j+k+l+0] = pxlView[bt+0]; 
          zpxlView[i+j+k+l+1] = pxlView[bt+1]; 
          zpxlView[i+j+k+l+2] = pxlView[bt+2]; 
          zpxlView[i+j+k+l+3] = pxlView[bt+3]; 
        } 
      } 
      bt+=n; 
    } 
  } 
} 

function zoomByte() { 
  
}

alert('1'); 

