window.document.onkeydown = function (e) {
    if (!e) {
        e = event;
    }
    if (e.keyCode == 27) {
        lightbox_close();
    }
    if (e.keyCode == 28) {
        lightbox1_close();
    }
    if (e.keyCode == 29) {
        lightbox2_close();
    }
    
}

function lightbox_open() {
    var lightBoxVideo = document.getElementById("VisaChipCardVideo");
    window.scrollTo(0, 0);
    document.getElementById('light').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
    lightBoxVideo.play();
}

function lightbox1_open() {
    var lightBoxVideo1 = document.getElementById("VisaChipCardVideo1");
    window.scrollTo(0, 0);
    document.getElementById('light1').style.display = 'block';
    document.getElementById('fade1').style.display = 'block';
    lightBoxVideo1.play();
}
function lightbox2_open() {
    var lightBoxVideo2 = document.getElementById("VisaChipCardVideo2");
    window.scrollTo(0, 0);
    document.getElementById('light2').style.display = 'block';
    document.getElementById('fade2').style.display = 'block';
    lightBoxVideo2.play();
}

function lightbox_close() {
    var lightBoxVideo = document.getElementById("VisaChipCardVideo");
    document.getElementById('light').style.display = 'none';
    document.getElementById('fade').style.display = 'none';
    lightBoxVideo.pause();
}
function lightbox1_close() {
    var lightBoxVideo1 = document.getElementById("VisaChipCardVideo1");
    document.getElementById('light1').style.display = 'none';
    document.getElementById('fade1').style.display = 'none';
    lightBoxVideo1.pause();
}
function lightbox2_close() {
    var lightBoxVideo2 = document.getElementById("VisaChipCardVideo2");
    document.getElementById('light2').style.display = 'none';
    document.getElementById('fade2').style.display = 'none';
    lightBoxVideo2.pause();
}