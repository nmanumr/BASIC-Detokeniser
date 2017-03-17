var electron = require('electron');
const { dialog } = electron.remote


const holder = document.getElementById('holder')
holder.ondragover = () => {
    return false;
}
holder.ondragleave = holder.ondragend = () => {
    return false;
}
holder.ondrop = (e) => {
    e.preventDefault()
    for (let f of e.dataTransfer.files) {
        console.log('File(s) you dragged here: ', f.path)
    }
    return false;
}

document.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
});


// inline remove button
$(".remove-this").on("click", function() {
    var tr = $(this).parent().parent();
    $(tr).remove();
});

// remove selected
$(".remove-row").on("click", function() {
    $(".mdl-dialog__addContent").remove();

    if ($(".mdl-data-dynamictable tbody").find('tr.is-selected').length != 0) {
        $(".mdl-data-dynamictable tbody").find('tr.is-selected').remove();
        $(".mdl-data-dynamictable thead tr").removeClass("is-selected");
        $(".mdl-data-dynamictable thead tr th label").removeClass("is-checked");
        componentHandler.upgradeDom();
    }
});


function addFile(path) {
    var fileName = getFileName(path);
    var outPath = getFolderPath(path) + '\out\\' + getFileNameWithExt(path);
    var fileType = "Tokenised"; // TODO: get file type from detokeniser

    var _row = $(".mdl-data-dynamictable tbody").find('tr');
    var template = $('#basketItemTemplate').html();
    var _newRow = template.replace(/{{id}}/gi, 'checkbox-' + new Date().getTime())
        .replace(/{{filepath}}/gi, path)
        .replace(/{{filename}}/gi, fileName)
        .replace(/{{outpath}}/gi, outPath)
        .replace(/{{filetype}}/gi, fileType);

    $(".mdl-data-dynamictable tbody").append(_newRow);
    componentHandler.upgradeAllRegistered();
}

function getFileNameWithExt(path) {
    return getFileName(path) + '.' + getFileExt(path);
}

function getFolderPath(path) {
    var index = path.lastIndexOf('\\');
    return path.substr(0, index + 1);
}

function getFileExt(path) {
    var index = path.lastIndexOf('.');
    return path.slice(index + 1 - path.length);
}

function getFileName(path) {
    var index = path.lastIndexOf('\\');
    return path.slice(index + 1 - path.length).replace('.' + getFileExt(path), '');
}


$(".add-file").on("click", function() {
    var files = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections', 'showHiddenFiles', 'createDirectory'],
        filters: [
            { name: 'BASIC files', extensions: ['BAS', 'BAZ'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });
    for (var file of files) {
        addFile(file);
    }
});
$(document).on("click", ".mdl-checkbox", function() {
    var _tableRow = $(this).parents("tr:first");
    if ($(this).hasClass("is-checked") === false) {
        _tableRow.addClass("is-selected");
    } else {
        _tableRow.removeClass("is-selected");
    }

});

$(document).on("click", "#checkbox-all", function() {
    _isChecked = $(this).parent("label").hasClass("is-checked");
    if (_isChecked === false) {
        $(".mdl-data-dynamictable").find('tr').addClass("is-selected");
        $(".mdl-data-dynamictable").find('tr td label').addClass("is-checked");
    } else {
        $(".mdl-data-dynamictable").find('tr').removeClass("is-selected");
        $(".mdl-data-dynamictable").find('tr td label').removeClass("is-checked");
    }
});