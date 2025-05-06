import os
import random
from dotenv import load_dotenv
from Minijeux.QuiVeuxGagnerDesMouki import get_all_questions
load_dotenv()
global le_bon_chiffre

jeu_actif = None


def lancer_qvgdm(message):
    global question
    question = None
    global score
    global questions
    score = {}
    questions = get_all_questions()
    random.shuffle(questions)
    return next_question()


def get_prompt(question, options):
    prompt = question + "\n"
    for i, option in enumerate(options, 1):
        prompt += f"{i}. {option} | "
    return prompt


def answer_question():
    global questions
    global question
    global score
    global reponse_joueurs
    if question is not None:
        reponse = question["reponse"]
        winning_index = question["options"].index(reponse) + 1
        list_winning_player = " "
        for pseudo, indice in reponse_joueurs.items():
            if indice == winning_index:
                list_winning_player += f"{pseudo} | "
                if pseudo not in score:
                    score[pseudo] = 1
                else:
                    score[pseudo] += 1
        list_winning_player = list_winning_player[:-1]
        if list_winning_player != "":
            list_winning_player = f", les joueurs avec la bonne réponse : {list_winning_player}"
        return f"La réponse à la question était : {reponse} {list_winning_player}"


def stop_game():
    global score, jeu_actif
    result_sorted = dict(sorted(score.items())[::-1])
    result = "Le jeu est terminé, r'gad' qui cé ka gagné : "
    for pseudo, player_score in result_sorted.items():
        result += f"{pseudo} : {player_score} | "
    jeu_actif = None
    return result[:-1]


def get_score():
    global score
    result = "Le score actuel est :"
    for pseudo, player_score in score.items():
        result += f"{pseudo} : {player_score} | "
    return result[:-1]


def next_question():
    global questions
    global question
    global score
    global reponse_joueurs
    if len(questions) > 0:
        question = questions[0]
        questions = questions[1:]
        reponse_joueurs = {}
        prompt = get_prompt(question["question"], question["options"])
        return prompt
    return "C'est pas possible y'a plus de question lol"


def lancer_jeu(nom_jeu, message):
    global jeu_actif, le_bon_chiffre
    if jeu_actif is None:
        jeu_actif = nom_jeu
        if jeu_actif == "juste_mouki":
            le_bon_chiffre = random.randint(1, 1000)
            return "Le meuga jeu de la mort est lancé mettez un chiffre entre 1 et 1000 et tenté de gagnez un " \
                   "super Kdo "
        elif jeu_actif == "qvgdm":
            return lancer_qvgdm(message)


def jeu_handler(cmd, message):
    global jeu_actif
    if message.author.name.lower() == os.getenv("CHANNEL").lower():
        if cmd == "pimoukigold":
            return lancer_jeu("juste_mouki", message)
        elif cmd == "jeu2":
            return lancer_jeu("qvgdm", message)
        elif cmd == "answer":
            return answer_question()
        elif cmd == "next":
            return next_question()
        elif cmd == "score":
            return get_score()
        elif cmd == "end":
            return stop_game()
    if jeu_actif is not None:
        return participer_jeu(jeu_actif, cmd, message)


def participer_jeu(nom_jeu, cmd, message):
    if nom_jeu == "juste_mouki":
        return juste_mouki(cmd, message)
    elif nom_jeu == "qvgdm":
        return participation_qvgdm(cmd, message)


def juste_mouki(cmd, message):
    try:
        global le_bon_chiffre, jeu_actif
        cmd = int(cmd)
        if cmd < le_bon_chiffre:
            if le_bon_chiffre - cmd > 10:
                return f' C\'est plus grand {message.author.name} pimoukAstor '
            else:
                return f' Tes pas loin {message.author.name}, mais c\'est plus pimoukGolo   '
        elif cmd > le_bon_chiffre:
            if cmd - le_bon_chiffre > 10:
                return f' C\'est plus petit {message.author.name} pimoukAstor  '
            else:
                return f' Tes pas loin {message.author.name}, mais c\'est moins pimoukAstor'
        else:
            le_bon_chiffre = None
            jeu_actif = None
            return f' pimoukOporc pimoukOporc  Bravo {message.author.name} tu as gagné  pimoukOrtu  pimoukOrtu '
    except:
        pass


def participation_qvgdm(cmd, message):
    global reponse_joueurs
    player = message.author.name
    try:
        cmd = int(cmd)
        if 1 <= cmd <= 4:
            if player not in reponse_joueurs:
                reponse_joueurs[player] = cmd
    except:
        pass
