G.f_copy = function () {
  // Convert canvas content to a Blob
  G.main_canvas.toBlob(function (blob) {
    // Write Blob to the clipboard
    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      .then(function () {
        console.log('Canvas image copied to clipboard successfully');
      })
      .catch(function (error) {
        console.error('Unable to copy canvas image to clipboard:', error);
      });
  });
}

G.f_save = function () {
  //данные из холста
  const dataUrl = G.main_canvas.toDataURL('image/png');
  //временная ссылка 
  const link = document.createElement('a');
  //качай наши данные
  link.href = dataUrl;

  //строка - имя сохраняемого файла
  link.download = ('png_' + G.f_clear() + '.png').replace("=", "_");
  //временно создай ссылку
  document.body.appendChild(link);
  //кликай на ссылку
  link.click();
  //после клика - уничтожь ссылку
  document.body.removeChild(link);
}

//кнопки "копируй", "сохрани"
G.main_button_copy = window.document.getElementById('idButtonCopy');
G.main_button_save = window.document.getElementById('idButtonSave');

//события нажатия на кнопки "копируй", "сохрани"
G.main_button_copy.onclick = (function () { G.f_copy() });
G.main_button_save.onclick = (function () { G.f_save() });