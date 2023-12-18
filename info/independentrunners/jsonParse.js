const fs = require('fs');
const { QuickDB } = require("quick.db");

const db = new QuickDB({ filePath: "../../json.sqlite" });

async function hello() {

const allData = await db.all();
await fs.promises.writeFile('data.json', JSON.stringify(allData, null, 2), 'utf8');

console.log('done writing')
}

async function deleteNonNumericIds() {
  const allKeys = await db.all()
  const mapKeys = allKeys.map(entry => entry.id);

  mapKeys.forEach(async (key) => {
    if (isNaN(key)) {
    if (key.startsWith('children_')) {
    	const id = key.substring(9)
    	const childrenAmount = await db.get(key)
    	await db.set(id+'.children', childrenAmount)
      	await db.delete(key);
    	return;
    }
    if (key.startsWith('pet_')) {
    	const id = key.substring(4)
    	const childrenAmount = await db.get(key)
    	await db.set(id+'.pet', childrenAmount)
      	await db.delete(key);
    	return;
    }
    if (key.startsWith('hotel_')) {
    	const id = key.substring(6)
    	const childrenAmount = await db.get(key)
    	await db.set(id+'.hotel', childrenAmount)
      	await db.delete(key);
    	return;
    }
      await db.delete(key);
      console.log(`Deleted non-numeric entry with key: ${key}`);
    }
  });

}

deleteNonNumericIds()