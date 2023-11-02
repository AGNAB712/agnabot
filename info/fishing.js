//key is [trash, common, rare, legendary, artifact]

const fishingArray = 
[[110, 10, 0, 0, 0], //level 0-5
[110, 12, 4, 0, 0], //level 5-10
[110, 15, 7, 3, 0], //10-15 (etc)
[110, 15, 7, 3, 1],
]

const fishingLootMap = {
trash: ['./images/fishing/fishables/plastic bag.png', './images/fishing/fishables/moss ball.png', './images/fishing/fishables/sand dollar.png'],
common: ['./images/fishing/fishables/bass.png', './images/fishing/fishables/bluegill.png', './images/fishing/fishables/guppy.png'],
rare: ['./images/fishing/fishables/axolotl.png', './images/fishing/fishables/dab.png', './images/fishing/fishables/starfish.png'],
legendary: ['./images/fishing/fishables/banded shark.png', './images/fishing/fishables/golden tench.png', './images/fishing/fishables/sea spider.png'],
}

const artifacts = {

}

module.exports = {
fishingArray, fishingLootMap
}