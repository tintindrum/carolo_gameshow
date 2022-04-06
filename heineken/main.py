import pygame
import math
from game import Game
from sounds import SoundManager
pygame.init()

#definir la clock
clock = pygame.time.Clock()
FPS = 144

# generer la fenetre du jeu
pygame.display.set_caption("Heineken")
screen = pygame.display.set_mode((1080, 720))

#importer le background du jeu 
background = pygame.image.load('assets/bg.jpg')

#importer ou charger la banniere 
banner = pygame.image.load('assets/banner.png')
banner = pygame.transform.scale(banner, (500, 500))
banner_rect = banner.get_rect()
banner_rect.x = math.ceil(screen.get_width() / 4)

#importer ou charger le bouton pour jouer et lancer la partie
play_button = pygame.image.load('assets/button.png')
play_button = pygame.transform.scale(play_button, (400, 150))
play_button_rect = play_button.get_rect()
play_button_rect.x = math.ceil(screen.get_width() / 3.33)
play_button_rect.y = math.ceil(screen.get_height() / 2)

#charger notre jeu 
game = Game()

running = True

# boucle tant que cette condition est vrai
while running:

    # appliquer l'arriere plan du jeu 
    screen.blit(background, (0, -200))
    
    #verifier si le jeu a commencer ou non
    if game.is_playing:
        #declancher les instructions de la partie
        game.update(screen)
    #verifier si le jeu n'as pas commencer
    else:
        #ajouter l'ecran de bienvenue
        screen.blit(play_button, (play_button_rect))
        screen.blit(banner, banner_rect)
        

    #mettre a jour l'ecran
    pygame.display.flip()

     # si le joueur ferme cette fenetre
    for event in pygame.event.get():
         #que l'evevement est fermeture de la fenetre
        if event.type == pygame.QUIT:
             running = False
             pygame.quit()
             print("Fermeture du jeu")
        #detecter si un joueur lache une touche du clavier
        elif event.type == pygame.KEYDOWN:
            game.pressed[event.key] = True

        #detecter la touche espace est enclencher pour lancer le projectile
            if event.key == pygame.K_SPACE:
                if game.is_playing:
                    game.player.launch_projectile()
                else:
                    #mettre le jeu en mode lancer
                    game.start()
                    #jouer le son
                    game.sound_manager.play('click')
                    

        elif event.type == pygame.KEYUP:
            game.pressed[event.key] = False

        elif event.type == pygame.MOUSEBUTTONDOWN:
            #verification pour savoir si la souris touche le bouton jouer
            if play_button_rect.collidepoint(event.pos):
                #mettre le jeu en mode lancer
                game.start()
                #jouer le son
                game.sound_manager.play('click')
    
    #fixé le nombre de fps sur la clock
    clock.tick(FPS)