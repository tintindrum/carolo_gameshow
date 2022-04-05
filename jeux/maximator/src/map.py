from dataclasses import dataclass
import pygame, pytmx, pyscroll

from src.player import NPC


@dataclass
class Portal:
    from_world: str
    origin_point: str
    target_world: str
    teleport_point: str


@dataclass
class Map:
    name: str
    walls: list[pygame.Rect]
    group: pyscroll.PyscrollGroup
    tmx_data: pytmx.TiledMap
    portals: list[Portal]
    npcs: list[NPC]


class MapManager:

    def __init__(self, screen, player):
        self.maps = dict()
        self.screen = screen
        self.player = player
        self.current_map = "world"

        self.register_map("world", portals=[
            Portal(from_world="world", origin_point="enter_house", target_world="house", teleport_point="spawn_house"),
            Portal(from_world="world", origin_point="enter_house2", target_world="house2", teleport_point="spawn_house"),
            Portal(from_world="world", origin_point="enter_dungeon", target_world="dungeon", teleport_point="spawn_dungeon"),
            Portal(from_world="world", origin_point="enter_chemin", target_world="foret", teleport_point="spawn_village")
        ], npcs=[
            NPC("paul", nb_points=15, dialog=["Salut, bienvenue dans Maximator !",
                                                     "Je m'appelle Jean Julien, je suis le doyen du village.",
                                                     "Si tu souhaites plus d'informations je te conseille, ",
                                                     "d'aller voir Romain le maire du village.",
                                                     "Bonne aventure à toi !"]),
            NPC("soldat", nb_points=1, dialog=["Bouge de la minus !", "C'est dangereux par là !"]),
            NPC("panneau",nb_points=1, dialog=["Chemin vers la grotte."]),
            NPC("panneau1",nb_points=1, dialog=["Maison de Jean Julien."]),
            NPC("panneau2",nb_points=1, dialog=["Maison de Monsieur le Maire."]),
            NPC("panneau3",nb_points=1, dialog=["Chemins vers PlomVille."]),
            NPC("panneau4",nb_points=1, dialog=["Maison de Andy le sauvage."])
        ])
        self.register_map("foret", portals=[
            Portal(from_world="foret", origin_point="enter_village", target_world="world", teleport_point="spawn_chemin_enter_exit")
        ], npcs=[
            NPC("paysan", nb_points=7, dialog=["Bonjour jeune homme.",
                                                "Je suis Andy le paysan du village.",
                                                "Si tu souhaite te rendre en ville",
                                                "prend le chemins en face de mon champs."]),
            NPC("panneau", nb_points=1, dialog=["Zone en construction !"])
        ])
        self.register_map("house", portals=[
            Portal(from_world="house", origin_point="exit_house", target_world="world", teleport_point="enter_house_exit")
        ])
        self.register_map("house2", portals=[
            Portal(from_world="house2", origin_point="exit_house", target_world="world", teleport_point="exit_house2")
        ])
        self.register_map("dungeon", portals=[
            Portal(from_world="dungeon", origin_point="exit_dungeon", target_world="world", teleport_point="dungeon_exit_spawn")
        ], npcs=[
            NPC("boss", nb_points=2, dialog=["Mwaaaaaaaaaa !!!", "Je suis le gardien de ce lieu !"])
        ])

        self.teleport_player("player")
        self.teleport_npcs()

    def check_npc_collisions(self, dialog_box):
        for sprite in self.get_group().sprites():
            if sprite.feet.colliderect(self.player.rect) and type(sprite) is NPC:
                dialog_box.execute(sprite.dialog)

    def check_collisions(self):
        #portails
        for portal in self.get_map().portals:
            if portal.from_world == self.current_map:
                point = self.get_object(portal.origin_point)
                rect = pygame.Rect(point.x, point.y, point.width, point.height)

                if self.player.feet.colliderect(rect):
                    copy_portal = portal
                    self.current_map = portal.target_world
                    self.teleport_player(copy_portal.teleport_point)

        #collision
        for sprite in self.get_group().sprites():

            if type(sprite) is NPC:
                if sprite.feet.colliderect(self.player.rect):
                    sprite.speed = 0
                else:
                    sprite.speed = 0.5

            if sprite.feet.collidelist(self.get_walls()) > -1:
                sprite.move_back()

    def teleport_player(self, name):
        point = self.get_object(name)
        self.player.position[0] = point.x
        self.player.position[1] = point.y
        self.player.save_location()

    def register_map(self, name, portals=[], npcs=[]):
        # charger la carte (tmx)
        tmx_data = pytmx.util_pygame.load_pygame(f"../map/{name}.tmx")
        map_data = pyscroll.data.TiledMapData(tmx_data)
        map_layer = pyscroll.orthographic.BufferedRenderer(map_data, self.screen.get_size())
        map_layer.zoom = 2

        # definir une liste qui va stocker les rectangles de collision
        walls = []

        for obj in tmx_data.objects:
            if obj.type == "collision":
                walls.append(pygame.Rect(obj.x, obj.y, obj.width, obj.height))

        # dessiner le groupe de calques
        group = pyscroll.PyscrollGroup(map_layer=map_layer, default_layer=5)
        group.add(self.player)

        #recuperer tout les npcs pour les ajouter au groupe
        for npc in npcs:
            group.add(npc)

        # Enregistrer la nouvelle carte chargée
        self.maps[name] = Map(name, walls, group, tmx_data, portals, npcs)

    def get_map(self): return self.maps[self.current_map]

    def get_group(self): return self.get_map().group

    def get_walls(self): return self.get_map().walls

    def get_object(self, name): return self.get_map().tmx_data.get_object_by_name(name)

    def teleport_npcs(self):
        for map in self.maps:
            map_data = self.maps[map]
            npcs = map_data.npcs

            for npc in npcs:
                npc.load_points(map_data.tmx_data)
                npc.teleport_spawn()

    def draw(self):
        self.get_group().draw(self.screen)
        self.get_group().center(self.player.rect.center)

    def update(self):
        self.get_group().update()
        self.check_collisions()

        for npc in self.get_map().npcs:
             npc.move()