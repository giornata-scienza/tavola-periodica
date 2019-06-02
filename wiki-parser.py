import wikipedia
import sys

wikipedia.set_lang("it")
elemento = sys.argv[1:]
page = wikipedia.page(elemento)

print(wikipedia.summary(elemento))
