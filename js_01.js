//глобальная переменная для всей нашей программы
var G = {};

//холст для рисования листовертней (перевёртышей на 180 градусов)
G.main_canvas = window.document.getElementById('idCanvas');
//строка для ввода (русские буквы, возможен один знак равно: для оборотней)
G.main_input = window.document.getElementById('idInput');

//размеры квадратных клеток (где все символы перевёртыши)
G.cell_size_xy = [64, 64];
G.LETTERS_31_EQ = "=АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЭЮЯ";
G.LETTERS_33_EQ = "=АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

//очиcть  строку от посторонних символов (кроме равно и русских букв, кроме "Ё" и "Ь")
G.f_clear = function (s = G.main_input.value) {
  s = s.toUpperCase();
  let s_new = ""
  //сколько знаков равно обнаружено
  let n_equals = 0;
  for (let i = 0; i < s.length; i++) {
    if ("=".includes(s[i])) {
      n_equals += 1;
      //если есть второй знак равно, то выходи и верни строку
      if (n_equals >= 2) {
        return s_new;
      }
    }
    //добавь русскую букву или один знак равно
    if (G.LETTERS_33_EQ.includes(s[i]))
      s_new += s[i];
  }
  return s_new;
}

//риссуй русское слово листовертень
//из книги Калинина "Видение Тайны, издательство Кучково Поле, 2012 год"
G.f_draw_word = function (russian_word = G.main_input.value) {
  //только заглавные буквы
  let s = russian_word.toUpperCase();

  let is_transparant = false;
  if ((s.length) && (s[-1] == "-")) {
    is_transparant = true;
    s = s.slice(0, -1);
  }

  //убери все посторонние символы
  s = G.f_clear();
  if (s.length == 0) { return; }

  //без Ё и мягкого знака (используй Е и Ъ)
  s = s.replaceAll("Ё", "Е").replaceAll("Ь", "Ъ");


  //если есть равенство, то рисуй слово-оборотень
  let s2 = s.split("=");
  //при переворачивании читать то же самое, либо слово-оборотень (после знака равно)
  let s_0_1 = [s2[0], s2[s2.length == 1 ? 0 : 1].split("").reverse().join("")];

  //длина - число символов в картинке
  let my_len = Math.min(s_0_1[0].length, s_0_1[1].length);
  //массив, заполненный нулями
  let arr_order = new Array(my_len).fill(0);
  //пары заглавных русских букв
  let arr_pairs = arr_order.map((value, i) => s_0_1[0][i] + s_0_1[1][i]);
  //пути к файлам (имя файэла - это пара букв, 31*31 файла-картинки уже есть)
  let arr_paths = arr_pairs.map(value => "pairs/" + value + ".jpeg");

  //генерируй размеры картинки в зависимости от длины слова
  G.main_canvas.width = G.cell_size_xy[0] * arr_pairs.length;
  G.main_canvas.height = G.cell_size_xy[1];
  let local_context = G.main_canvas.getContext('2d', { willReadFrequently: true });

  //вставляй символ на нужно место на холсте, все символы имеют одинаковый размер
  function f_crop(text_link, i_char_position) {
    let imageObj = new Image();
    //вставляй символ только после загрузки изображения
    imageObj.onload = function () {
      //с какого момента рисовать символ (по оси "Х")
      let X = i_char_position * G.cell_size_xy[0];
      //параметры для вставки изображения (все клетки-символы имеют одинаковый размер)
      local_context.drawImage(imageObj, X, 0);

      let dataImg = local_context.getImageData(X, 0, ...G.cell_size_xy);
      let pix = dataImg.data;

      if (is_transparant) {
        for (let i = 0; i < pix.length; i += 4) {
          //pix[i + 0] = 255 - pix[i + 0];
          //pix[i + 1] = 255 - pix[i + 1];
          //pix[i + 2] = 255 - pix[i + 2];
          //альфа-канал - полупрозрачность (можно и без этой строки, тогда будет белый фон)
          pix[i + 3] = 255 - Math.round((pix[i + 0] + pix[i + 1] + pix[i + 2]) / 3);
        }
      }

      local_context.putImageData(dataImg, X, 0);
    };
    imageObj.src = text_link;
  }

  //вставляй символы по одному слева направо
  for (let i = 0; i < arr_paths.length; i++)
    f_crop(arr_paths[i], i);

}

//нарисуй пример: слово "слово"
G.f_draw_word();
//события изменения текста в строке ввода
G.main_input.oninput = (function () { G.f_draw_word() });