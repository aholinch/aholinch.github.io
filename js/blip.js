function getDropRegion()
{
  return document.getElementById("drop-region");
}

function getImagePreviewRegion()
{
  return document.getElementById("image-preview");
}

function preventDefault(e)
{
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e)
{
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files);
}

function enableDnD()
{
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multipe = true;

  var dr = getDropRegion();

  dr.addEventListener('click',function(){
    fileInput.click();
  });

  fileInput.addEventListener('change', function(){
    var files = fileInput.files;
    handleFiles(files);
  });

  dr.addEventListener('dragenter', preventDefault, false);
  dr.addEventListener('dragleave', preventDefault, false);
  dr.addEventListener('dragover', preventDefault, false);
  dr.addEventListener('drop', preventDefault, false);

  dr.addEventListener('drop', handleDrop, false);
}

function handleFiles(files)
{
  var len = files.length;
  for(var i=0; i<len; i++)
  {
    if(validateImage(files[i]))
    {
      previewImage(files[i]);
    }
  }
}

function validateImage(image)
{
  // check type, consider adding more
  var validTypes = ['image/jpeg','image/png','image/gif'];

  if(validTypes.indexOf(image.type) === -1)
  {
    console.log("invalid type " + image.type);
    return false;
  }

  // max size
  var maxSize = 20e6;
  if(image.size > maxSize)
  {
    console.log("File is too big " + image.size);
    return false;
  }

  return true;
}

function previewImage(image)
{
  var imgView = document.createElement("div");
  imgView.className = "image-view";

  var ipr = getImagePreviewRegion();
  ipr.appendChild(imgView);

  var img = document.createElement("img");
  img.onclick = onImageClick;
  imgView.appendChild(img);

  var reader = new FileReader();
  reader.onload = function(e){
    img.src = e.target.result;
  }

  reader.readAsDataURL(image);
}

var imgmode="init";

var minyp = 0;
var maxyp = 0;
var minyv = 0;
var maxyv = 0;

var minxp = 0;
var maxxp = 0;
var minxv = 0;
var maxxv = 0;

function setImgMode(mode)
{
  imgmode=mode;
  if(mode == 'measure')
  {
    minyv = parseFloat(document.getElementById("minyval").value);
    minyp = parseFloat(document.getElementById("minypix").value);
    maxyv = parseFloat(document.getElementById("maxyval").value);
    maxyp = parseFloat(document.getElementById("maxypix").value);

    minxv = parseFloat(document.getElementById("minxval").value);
    minxp = parseFloat(document.getElementById("minxpix").value);
    maxxv = parseFloat(document.getElementById("maxxval").value);
    maxxp = parseFloat(document.getElementById("maxxpix").value);
  }
}

function recordMeasurement(x,y)
{
  var rngXval = maxxv-minxv;
  var rngXpix = maxxp-minxp;
  var rngYval = maxyv-minyv;
  var rngYpix = maxyp-minyp;

  var fx = rngXval/rngXpix;
  var fy = rngYval/rngYpix;

  var dx = x-minxp;
  var dy = y-minyp;

  var yv = dy*fy+minyv;
  var xv = dx*fx+minxv;

  var txt = document.getElementById("measured");

  var str = txt.value;
  var line = "\r\n";

  if(str === null || str == '')
  {
    line = "";
  }
  console.log(xv + "," + yv);

  str = str + line + xv + "," + yv;
  txt.value = str;
}

function onImageClick(e)
{
  if(imgmode=='miny')
  {
    minyp = e.offsetY;
    document.getElementById("minypix").value = minyp;
  }
  else if(imgmode=='maxy')
  {
    maxyp = e.offsetY;
    document.getElementById("maxypix").value = maxyp;
  }
  else if(imgmode=='minx')
  {
    minxp = e.offsetX;
    document.getElementById("minxpix").value = minxp;
  }
  else if(imgmode=='maxx')
  {
    maxxp = e.offsetX;
    document.getElementById("maxxpix").value = maxxp;
  }
  else if(imgmode=='measure')
  {
    recordMeasurement(e.offsetX,e.offsetY);
  }
}

function clearPoints()
{
  document.getElementById("measured").value = "";
}
