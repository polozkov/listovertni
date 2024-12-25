STRING_INPUT_ARRAY_TEXT = """Александр
Александра
Алексей
Алиса
Анатолий
Андрей
Анна
Антон
Аня
Борис
Валентин
Валентина
Валерий
Валя
Василий
Вера
Вика
Виктор
Владимир
Вова
Галина
Георгий
Денис
Дима
Дмитрий
Евгений
Евдокия
Екатерина
Елена
Елизавета
Зинаида
Зоя
Иван
Игорь
Илья
Ирина
Катя
Клавдия
Куба
Лидия
Любовь
Людмила
Марина
Мария
Митя
Михаил
Надежда
Наталья
Николай
Нина
Ольга
Пеппи
Пётр
Саша
Светлана
Сергей
Тамара
Таня
Татьяна
Тима
Тимофей
Тимоша
Фёдор
Федя
Чарли
Эльвин
Юлия
Юля
Юрий"""

STRING_INPUT_ARRAY = STRING_INPUT_ARRAY_TEXT.split("\n")
print(STRING_INPUT_ARRAY)

N_COLUMNS = 3
GAP_WORD_BORDER = 8
GAP_COLUMNS = 100
CELL_SIZE_X,CELL_SIZE_Y = 64,64

import cv2
import numpy as np
import math

STRING_INPUT_ARRAY = sorted(STRING_INPUT_ARRAY)
while len(STRING_INPUT_ARRAY) % N_COLUMNS != 0:
    STRING_INPUT_ARRAY.append("")

LEN = len(STRING_INPUT_ARRAY)
N_ROWS = math.ceil(LEN / N_COLUMNS)

def f_gen_image(w, h, b=255, g=255, r=255):
    b, g, r = 255,255,255
    image = np.zeros((h, w, 3), np.uint8)
    image[:, :, 0] = b
    image[:, :, 1] = g
    image[:, :, 2] = r
    return image
    

def f_generate_image(STRING_INPUT):
    STRING_0_1 = STRING_INPUT.split("_") if ("_" in STRING_INPUT) else [STRING_INPUT, STRING_INPUT]
    file_name = STRING_0_1[0] if  STRING_0_1[0] == STRING_0_1[1] else STRING_INPUT
    STRING_0_1[1] = "".join(reversed(STRING_0_1[1]))
    
    for i in range(2):
        STRING_0_1[i] = STRING_0_1[i].upper().replace("Ь", "Ъ").replace("Ё", "Е")

    string_length = len(STRING_0_1[0])
    image = f_gen_image(string_length * CELL_SIZE_X, CELL_SIZE_Y)

    for i_symbol in range(string_length):
        X = i_symbol * CELL_SIZE_X
        two_letters = STRING_0_1[0][i_symbol] + STRING_0_1[1][i_symbol]
        #print(STRING_INPUT+" "+two_letters)
        image[0:CELL_SIZE_Y, X:(X+CELL_SIZE_X)] = cv2.imread("pairs/" + two_letters + ".jpeg")
    
    return image

def f_max_width_for_col(n_col=0):    
    i_from = n_col * N_ROWS
    is_last_col = n_col == N_COLUMNS
    amount_for_testing = LEN % N_ROWS + 1 if is_last_col else N_ROWS
    return len(sorted((STRING_INPUT_ARRAY[i_from:i_from + amount_for_testing]), key=len)[-1])

def f_left_top(n):
    nx = n // N_ROWS
    ny = n % N_ROWS
    
    position_x = GAP_WORD_BORDER
    for i in range(0, nx):
        position_x += (f_max_width_for_col(i) * CELL_SIZE_X + GAP_WORD_BORDER + GAP_COLUMNS)
    position_y = ny * CELL_SIZE_Y + GAP_WORD_BORDER * (ny * 2 + 1)
    
    return [position_x, position_y]

def f_genarate_multi_image():
    size_x = -GAP_COLUMNS
    for i_col in range(N_COLUMNS):
        size_x += (f_max_width_for_col(i_col)*CELL_SIZE_X + GAP_WORD_BORDER*2 + GAP_COLUMNS)
    size_y = N_ROWS * CELL_SIZE_Y + GAP_WORD_BORDER * (N_ROWS * 2)
    
    image = f_gen_image(size_x, size_y, 128)
    for i in range (LEN):   
        STRING_INPUT = STRING_INPUT_ARRAY[i]
        if len(STRING_INPUT) > 0:
            x,y = f_left_top(i)  
            w = len(STRING_INPUT) * CELL_SIZE_X
            h = CELL_SIZE_Y
            image[y:y+h,x:x+w] = f_generate_image(STRING_INPUT)
        
    cv2.imwrite("Листовертни.jpeg", image, [cv2.IMWRITE_JPEG_QUALITY, 100])
    
f_genarate_multi_image()

