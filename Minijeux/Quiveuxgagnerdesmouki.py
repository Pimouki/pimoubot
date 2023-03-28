random.shuffle(questions)

def winning_mouki(cmd, message):

# Définir la fonction pour poser les questions
    async def ask_question(ctx, question_num, question, answer):
        # Envoyer la question sur le chat
        await ctx.send(f'Question {question_num}: {question}')

        # Attendre la réponse de l'utilisateur
        msg = await ctx.bot.wait_for('message', check=lambda m: m.author == ctx.author)

        # Vérifier si la réponse est correcte
        if msg.content.lower() == answer.lower():
            await ctx.send('Bonne réponse !')
            return True
        else:
            await ctx.send(f'Mauvaise réponse. La réponse correcte était {answer}')
            return False


    # Définir la commande pour lancer le jeu
    @bot.command(name='million')
    async def million(ctx):
        # Initialiser le jeu
        score = 0
        question_num = 0

        # Boucle pour poser les questions
        for q, a in questions:
            question_num += 1
            # Poser la question et vérifier la réponse
            if await ask_question(ctx, question_num, q, a):
                score += 1
            else:
                break
            # Vérifier si le joueur a gagné le million
            if score == len(questions):
                await ctx.send('Félicitations ! Vous avez gagné le million !')
                break
        # Envoyer le score final sur le chat
        await ctx.send(f'Votre score final est de {score}/{len(questions)}')
