import Levenshtein as lev
import re

def isLevSubstring(substring, string, precision):
    substring = substring.lower().strip()
    string = string.lower().strip()
    i = 0
    j = len(substring)
    if j > len(string):
        j = len(string)
    while j <= len(string):
        if lev.distance(string[i:j], substring) <= len(substring)/precision:
            pattern = '([^a-zA-Z]|^)' + string[i:j] + '([^a-zA-Z]|$)'
            substringRegex = re.compile(pattern)
            if len(substringRegex.findall(string)) > 0:
                return True
        i += 1
        j += 1
    return False    

def isWordSubstring(substring, string):
    splitString = re.split(' |,|\.|-|\/', string.lower())
    if substring.lower() in splitString:
        return True
    return False
