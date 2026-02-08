class AgnabotItem {
    constructor(name, value) {
        this.name = name
        this.shopDescription = `${value} AGNABUCKS`
        this.shopLabel = name
        this.value = value
        this.emoji = '❔'
        this.isInShop = false;
    }
    setEmoji(newEmoji) {
        this.emoji = newEmoji
        return this
    }
    setShopDescription(newShopDescription) {
        this.shopDescription = `${this.value} AGNABUCKS \n ${newShopDescription}`
        return this
    }
    setShopDescriptionDetail(newShopDescription) {
        this.shopDescription = newShopDescription
        return this
    }
    setLabel(newLabel) {
        this.shopLabel = newLabel
        return this
    }
    setIsInShop(shouldBeInShop) {
        this.isInShop = shouldBeInShop
        return this
    }
}

const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function incrementItem(id, item, amount) {
    const currentInv = await db.get(id+'.inv')
    const existing = currentInv.find(i => i.name === item.name)
    if (existing) {
        existing.quantity = existing.quantity+amount
    } else {
        currentInv.push({ ...item, quantity: amount })
    }
    await db.set(id+'.inv', currentInv)
}
async function decrementItem(id, item, amount) {
    const currentInv = await db.get(id+'.inv')
    const existing = currentInv.find(i => i.name === item.name)
    if (existing) {
        existing.quantity = existing.quantity-amount
        if (existing.quantity < 0) {
            existing.quantity = 0
        }
    } else {
        currentInv.push({ ...item, quantity: 0 })
    }
    await db.set(id+'.inv', currentInv)
}

module.exports = { AgnabotItem, incrementItem, decrementItem }