//key is [trash, common, rare, legendary, artifact]

const fishingArray = 
[[60, 15, 4, 1, 0], //level 0-5
[60, 17, 6, 2, 1], //level 5-10
[50, 20, 7, 3, 2], //10-15 (etc)
]

const fishingLootMap = {
trash: ['./images/fishing/fishables/plastic bag.png', './images/fishing/fishables/moss ball.png', './images/fishing/fishables/sand dollar.png'],
common: ['./images/fishing/fishables/bass.png', './images/fishing/fishables/bluegill.png', './images/fishing/fishables/guppy.png'],
rare: ['./images/fishing/fishables/axolotl.png', './images/fishing/fishables/dab.png', './images/fishing/fishables/starfish.png'],
legendary: ['./images/fishing/fishables/banded shark.png', './images/fishing/fishables/golden tench.png', './images/fishing/fishables/sea spider.png'],
}

module.exports = {
fishingArray, fishingLootMap
}