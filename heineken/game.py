import pygame
from player import Player
from monster import Monster, Mummy, Alien
from comet_event import CometFallEvent
from sounds import SoundManager

#cree une seconde classe qui va representer le jeu
class Game:

    def __init__(self):
        #definir si le jeu a commencer ou non
        self.is_playing = False
        #generer joueur
        self.all_players = pygame.sprite.Group()
        self.player = Player(self)
        self.all_players.add(self.player)
        #generer le manager de comet
        self.comet_event = CometFallEvent(self)
        #groupe de monstre
        self.all_monsters = pygame.sprite.Group()
        #gerer le son
        self.sound_manager = SoundManager()
        #mettre le score a 0
        self.font = pygame.font.Font("assets\my_custom_font.ttf", 25)
        self.score = 0
        self.pressed = {}

    def start(self):
        self.is_playing = True
        self.spawn_monster(Mummy)
        self.spawn_monster(Mummy)
        self.spawn_monster(Alien)

    def add_score(self, points=10):
        self.score += points

    def game_over(self):
        #remettre le jeu a zero, retirer les monstre, remettre le joueur a 100pv et remettre le jeu en attente
        self.all_monsters = pygame.sprite.Group()
        self.comet_event.all_comets = pygame.sprite.Group()
        self.player.health = self.player.max_health
        self.comet_event.reset_percent()
        self.is_playing = False
        self.score = 0
        #jouer le son
        self.sound_manager.play('game_over')

    def update(self, screen):
        #afficher le score sur l'ecran
        score_text = self.font.render(f"Score :{self.score}", 1, (0, 0, 0))
        screen.blit(score_text, (20, 20))

        #appliquer l'image du joueur
        screen.blit(self.player.image, self.player.rect)

        #actualiser la barre de vie du joueur
        self.player.update_health_bar(screen)

        #actualisé l'animation du joueur
        self.player.update_animation()

        #actualisé la barre d'evenment du jeu
        self.comet_event.update_bar(screen)

        #recuperer les projeciles du joueur
        for projectile in self.player.all_projectiles:
         projectile.move()

        #recuperer les monstres du jeu
        for monster in self.all_monsters:
         monster.forward()
         monster.update_health_bar(screen)
         monster.update_animation()

        #recuperer les comets de notre jeu
        for comet in self.comet_event.all_comets:
            comet.fall()

        #appliquer l'ensemble des images de mon groupe de projectile
        self.player.all_projectiles.draw(screen)

        #appliquzr l'ensemble des image de mon groupe de monstre
        self.all_monsters.draw(screen)

        #appliquer l'ensemble des images de mon groupe de comettes
        self.comet_event.all_comets.draw(screen)

        #verif si le joueur va a gauche ou a droite
        if self.pressed.get(pygame.K_RIGHT)and self.player.rect.x + self.player.rect.width < screen.get_width():
            self.player.move_right()
        elif self.pressed.get(pygame.K_LEFT) and self.player.rect.x > 0:
            self.player.move_left()

    def check_collision(self, sprite, group):
        return pygame.sprite.spritecollide(sprite, group, False, pygame.sprite.collide_mask)

    def spawn_monster(self, monster_class_name):
        self.all_monsters.add(monster_class_name.__call__(self))