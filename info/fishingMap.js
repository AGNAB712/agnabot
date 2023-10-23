//key is [trash, common, rare, legendary, artifact]

const fishingArray = 
[[90, 5, 2, 1, 0], //level 0-5
[87, 7, 4, 2, 1], //level 5-10
[85, 10, 7, 3, 2], //10-15 (etc)
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