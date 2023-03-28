'''
# creer une fonction max() qui vas renvoyer le resultat le plus hayt parmis 2 valeurs

def max():
    global a
    global b
    if a > b:
        print("a est plus grand que b")
    else:
        print("b est plus grand que a")

a = 500
b = 200

max()
'''

# tp : une fonction pour calculer le nombre de voyelles dans un mot
# définir une fonction get_vowels_numbers (mot)
# créer un compteur de voyelles
# pour chaque lettre du mot vous vérifiez s'il s'agit d'une voyelle
# si c'est le cas, on ajoute un au compteur
# à la fin de la fonction vous allez renvoyer le compteur



def get_vowels_numbers(mots):
    vowels = ["a", "e", "i", "o", "u", "y"]
    count = 0
    for char in mots:
        if char in vowels:
            count += 1
    return count



print(get_vowels_numbers("je suis la mort"))
