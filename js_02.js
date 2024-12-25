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

  const s = G.main_input.value;
  if (G.f_clear(s).length == 0) {return}
  const str_is_transparant = (s[s.length - 1] == "-") ? '_прозрачная_картинка.png' : '.png';
  console.log(s, str_is_transparant);
  //строка - имя сохраняемого файла
  link.download = ('png_' + G.f_clear() + str_is_transparant).replace("=", "_");
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