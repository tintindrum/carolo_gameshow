import pygame

#definir une classe qui va s'occuper des animations
class AnimateSprite(pygame.sprite.Sprite):

        #definir les choses a faire a la création de l'entité
    def __init__(self, sprite_name, size=(200, 200)):
        super().__init__()
        self.size = size
        self.image = pygame.image.load(f'assets/{sprite_name}.png')
        self.image = pygame.transform.scale(self.image, size)
        self.current_image = 0 #commencer l'animation de l'image
        self.images = animations.get(sprite_name)
        self.animation = False

    #definir une methode pour démarrer l'animation
    def start_animation(self):
        self.animation = True

        #definir une methode pour animer le sprite
    def animate(self, loop=False):

        #verifier si l'animation est active
        if self.animation:

            #passer a l'image suivante
            self.current_image += 1

            #verifier si on est a la fin de l'animation
            if self.current_image >= len(self.images):
                #remettre l'animation au départ
                self.current_image = 0

                #verifier si l'animation n'est pas en mode boucle
                if loop is False:

                    # désactivation de l'animation
                    self.animation = False
            #modifier l'image de l'animation précédente par la suivante
            self.image = self.images[self.current_image]
            self.image = pygame.transform.scale(self.image, self.size)

#definir une fonction pour charger les images d'un sprite
def load_animation_images(sprite_name):
        #charger les 24 images du sprite de son dossier
        images = []
        #recuperer le chemin du dossier pour ce sprite
        path = f"assets/{sprite_name}/{sprite_name}"

        #boucler chaque image dans le dossier
        for num in range(1, 24):
            image_path = path + str(num) + '.png'
            images.append(pygame.image.load(image_path))
            
        #renvoyer le contenu de la liste d'image
        return images


#definir un dictionnaire qui va contenir les images charger de chaque sprite
#mummy ->[..mummy.png,.........]
#mummy ->[..player.png,.........]
animations = {
    'mummy': load_animation_images('mummy'),
    'player': load_animation_images('player'),
    'alien': load_animation_images('alien')
}