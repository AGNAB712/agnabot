hej welcome to my epic dungeon maker epic dungeon yup
the things you can customize in a dungeon are
1. the dungeon name
2. the dungeon description
3. the minimum level required
4. all images for the dungeon (background, all enemy types)
5. names of the enemies
6. loot level of the dungeon

TO CUSTOMIZE NAME:
rename the folder to the name of the dungeon

TO CUSTOMIZE DESCRIPTION AND MINIMUM LEVEL:
tell agnab when he adds it

TO CUSTOMIZE ALL IMAGES:
replace all images in the folder with the images you want for your dungeon
make sure they are all png files named the exact same thing as in the template dungeon
for reference, the generated dungeon images are 750x500 pixels

the background image will automatically stretch to the height/width of the generated image

enemy images are a bit more tricky to replace, i would reccomend using the template images as a guide (especially for width)
enemy images are not stretched width or height wise, so feel free to increase the height (or width slightly, not too much or it will crop) of the template images
in the key.json file, the "yOffset" means the offset for all images from the top of the image in pixels
increasing the yOffset would move images down, and decreasing it would move them up

TO CUSTOMIZE NAMES OF THE ENEMIES
change the value of the enemy types in key.json

TO CHANGE THE LOOT LEVEL OF THE DUNGEON
change the number of the level key in key.json

{
	"basic": "Seahorse Swarm",
	"distributor": "Electric Eel",
	"healer": "Jellyfish",
	"tank": "Crab",
	"boss": "Stygiomedusa",
	"yOffset": 350,
	"level": 1
} 