import pandas as pd
from pandas import ExcelFile
import numpy as np
import Levenshtein as lev
import re
import levSubstring

titleRegex = re.compile(r'etaj')

floorRegex = re.compile(r'^([0-2]\d|\d)(?:\..*)?$')
strictFloorRegex = re.compile(r'[etajul.]{2,6} *([0-2]\d|\d)')
floorSlashFloorsRegex = re.compile(r'([0-2]\d|\d) *(?:\/|din) *([0-2]\d|\d)')
romanDigits = ({'i':1 ,'ii': 2, 'iii' :3, 'v': 5, 'iv': 4, 'vi': 6, 'vii': 7, 'viii': 8, 'x': 10, 'ix': 9,  
'xi': 11, 'xii': 12, 'xiii' :13, 'xiv': 14, 'xv': 15, 'xvi': 16, 'xvii': 17, 'xviii': 18, 'xix': 19, 'xx': 20})


def getCellWithoutRomanDigits(cell):
    for romanDigit in reversed(romanDigits):
        if levSubstring.isWordSubstring(romanDigit, cell):
            cell = cell.replace(romanDigit, str(romanDigits[romanDigit]))
    return cell


def getValidCell(cell):
    cell = str(cell).strip().lower()
    if cell == 'nan' or cell == '':
        return None
    if '/' in cell and '+' in cell:
        splitCell = cell.split('/')
        if len(splitCell[0]) == 1 and splitCell[0] == splitCell[1][-1]:
            return 'ultimul etaj'
    if '+' in cell:
        return 'intermediar'
    if 'parter' in cell or 'p' == cell or 'sol' in cell or (levSubstring.isWordSubstring('p', cell) and '+' not in cell):
        return 'parter'
    if 'intermed' in cell:
        return 'intermediar'
    if 'ultim' in cell or 'mans' in cell or 'm' == cell:
        return 'ultimul etaj'
    floorSlashFloors = floorSlashFloorsRegex.findall(cell)
    if len(floorSlashFloors) == 1:
        floor = int(floorSlashFloors[0][0])
        floors = int(floorSlashFloors[0][1])
        if floor == 0:
            return 'parter'
        if floor < floors or floors < floor:
            return 'intermediar'
        if floor == floors:
            return 'ultimul etaj'
    floor = floorRegex.findall(cell)
    if len(floor) == 1:
        floor = int(floor[0])
        if floor == 0:
            return 'parter'
        # IDEA: compare with medium block height in area based on data in training dataset
        if floor >= 8:
            return "ultimul etaj"
        else:
            return "intermediar"
#     cell = getCellWithoutRomanDigits(cell)
#     return getValidRomanCell(cell)


def getValidRomanCell(cell):
    floorSlashFloors = floorSlashFloorsRegex.findall(cell)
    if len(floorSlashFloors) == 1:
        floor = int(floorSlashFloors[0][0])
        floors = int(floorSlashFloors[0][1])
        if floor == 0:
            return 'parter'
        if floor < floors or floors < floor:
            return 'intermediar'
        if floor == floors:
            return 'ultimul etaj'
    floor = floorRegex.findall(cell)
    if len(floor) == 1:
        floor = int(floor[0])
        if floor == 0:
            return 'parter'
        return floor
    if '+' in cell:
        return 'intermediar'


def getValidForeignCell(cell):
    cell = str(cell).strip().lower()
    if cell == 'nan' or cell == '':
        return None
    if 'parter' in cell or 'p' == cell:
        return 'parter'
    if 'intermediar' in cell:
        return 'intermediar'
    if 'ultimul etaj' in cell or 'mansarda' in cell:
        return 'ultimul etaj'
    floor = strictFloorRegex.findall(cell)
    if len(floor) == 1:
        floor = int(floor[0])
        if floor == 0:
            return 'parter'
        return floor

        

