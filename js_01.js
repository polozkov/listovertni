//холст для рисования листовертней (перевёртышей на 180 градусов)
var main_canvas = window.document.getElementById('idCanvas');
//строка для ввода (русские буквы, возможен один знак равно: для оборотней)
var main_input = window.document.getElementById('idInput');

//размеры квадратных клеток (где все символы перевёртыши)
var cell_size_xy = [64,64];
var LETTERS_31_EQ = "=АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЭЮЯ";

//очсить  строку от посторонних символов (кроме равно и русских букв, кроме "Ё" и "Ь")
function f_clear(s) {
  var s_new = ""
  for (var i = 0; i < s.length; i++)
    if (LETTERS_31_EQ.includes(s[i]))
      s_new += s[i];
  return s_new;
}

//риссуй русское слово листовертень
//из книги Калинина "Видение Тайны, издательство Кучково Поле, 2012 год"
function f_draw_word(russian_word = main_input.value) {
  //только заглавные буквы
  var s = russian_word.toUpperCase();
  //без Ё и мягкого знака (используй Е и Ъ)
  s = s.replaceAll("Ё","Е").replaceAll("Ь","Ъ");
  //убери все посторонние символы
  s = f_clear(s);

  //если есть равенство, то рисуй слово-оборотень
  var s2 = s.split("=");
  //при переворачивании читать то же самое, либо слово-оборотень (после знака равно)
  var s_0_1 = [s2[0], s2[s2.length == 1 ? 0 : 1].split("").reverse().join("")];

  //длина - число символов в картинке
  var my_len = Math.min(s_0_1[0].length, s_0_1[1].length);
  //массив, заполненный нулями
  var arr_order = new Array(my_len).fill(0);
  //пары заглавных русских букв
  var arr_pairs = arr_order.map((value,i) => s_0_1[0][i] + s_0_1[1][i]);
  //пути к файлам (имя файэла - это пара букв, 31*31 файла-картинки уже есть)
  var arr_paths = arr_pairs.map(value => "pairs/"+value+".jpeg");

  //генерируй размеры картинки в зависимости от длины слова
  main_canvas.width = cell_size_xy[0] * arr_pairs.length;
  main_canvas.height = cell_size_xy[1];
  var main_context = main_canvas.getContext('2d');
  
  //вставляй символ на нужно место на холсте, все символы имеют одинаковый размер
  function f_crop(text_link, i_char_position) {
    var imageObj = new Image();
    //вставляй символ только после загрузки изображения
    imageObj.onload = function() {
      //с какого момента рисовать символ (по оси "Х")
      var X = i_char_position * cell_size_xy[0];
      //параметры для вставки изображения (все клетки-символы имеют одинаковый размер)
      main_context.drawImage(imageObj, X, 0);
    };
    imageObj.src = text_link;
  }

  //вставляй символы по одному слева направо
  for (var i = 0; i < arr_paths.length; i++)
    f_crop(arr_paths[i], i);
}

//нарисуй пример: слово "слово"
f_draw_word();
//события изменения текста в строке ввода
main_input.oninput = (function () {f_draw_word()});