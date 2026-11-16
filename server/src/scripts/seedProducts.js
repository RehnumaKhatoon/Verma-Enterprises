import '../config/loadEnv.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const photo = image => image.startsWith('/') ? image : image.startsWith('https://') ? image : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=82`;
const products = [
  // Sample prices are editable from the admin product form.
  ['Betta Fish','fish','Betta',450,'A vibrant, flowing-finned freshwater fish for a suitable, well-maintained aquarium.',12,'photo-1535591273668-578e31182c4f'],
  ['Goldfish','fish','Goldfish',250,'A bright, curious goldfish that needs a spacious, properly filtered aquarium.',15,'photo-1524704654690-b56c05c78a00'],
  ['Guppy Fish','fish','Guppy',120,'A lively, colourful livebearer that brings movement to a compatible community tank.',20,'photo-1522069169874-c58ec4b76be5'],
  ['Angelfish','fish','Angelfish',350,'An elegant freshwater fish with tall fins, best kept in a roomy, peaceful aquarium.',8,'/images/angelfish.webp'],
  ['Molly Fish','fish','Molly',150,'An active, adaptable livebearer for a stable freshwater community aquarium.',16,'photo-1516684732162-798a0062be99'],
  ['Neon Tetra','fish','Tetra',80,'A small schooling fish with a brilliant blue and red stripe; keep with a group of its kind.',25,'photo-1518467166778-b88f373ffec7'],
  ['Discus Fish','fish','Discus',1800,'A striking round-bodied fish that thrives in a spacious, carefully maintained aquarium.',6,'photo-1501747315-124a0eaca060'],
  ['Oscar Fish','fish','Oscar',900,'An intelligent, large cichlid that needs a generous tank and sturdy aquarium furnishings.',5,'https://4.bp.blogspot.com/-zBWzJXizTPQ/WJPlLZHmHJI/AAAAAAAAIJc/yXwPXeBDgYMGgmFoKKdjleAjv8kQ-p3UQCLcB/s1600/12.jpg'],
  ['Cherry Shrimp','fish','Shrimp',90,'A small, bright red freshwater shrimp that enjoys a planted tank with plenty of cover.',30,'https://ypko123400.godohosting.com/godo5/editor/lifes/goods/17/03/10/1000005370/1000005370_detail_011.jpg'],
  ['Mystery Snail','fish','Snail',180,'A peaceful freshwater snail with a colourful shell that grazes on aquarium surfaces.',10,'photo-1505685296765-3a2736de412f'],
  ['Java Moss','plants','Moss',220,'A versatile, fine-textured moss for attaching to aquarium wood, rock and other surfaces.',18,'https://cdn-ak.f.st-hatena.com/images/fotolife/k/kamita35/20210316/20210316201305.jpg'],
  ['Anubias Nana','plants','Anubias',350,'A hardy, compact plant with dark leaves; attach its rhizome to rock or driftwood.',12,'photo-1545241047-6083a3684587'],
  ['Amazon Sword','plants','Sword Plant',300,'A leafy centrepiece plant that grows best with nutritious substrate and room to spread.',10,'photo-1501004318641-b39e6451bec6'],
  ['Java Fern','plants','Fern',280,'A resilient fern with textured leaves that can be secured to aquarium hardscape.',14,'photo-1518531933037-91b2f5f229cc'],
  ['Vallisneria','plants','Background Plant',200,'Tall, ribbon-like leaves create a graceful green backdrop in freshwater aquariums.',16,'photo-1518977676601-b53f82aba655'],
  ['Hornwort','plants','Stem Plant',180,'A fast-growing, feathery stem plant that adds cover and texture to a freshwater tank.',15,'photo-1502082553048-f009c37129b9'],
  ['Dwarf Hairgrass','plants','Carpeting Plant',320,'A fine-bladed foreground plant for creating a lush, aquarium-friendly green carpet.',12,'photo-1470058869958-2a77ade41c02'],
  ['Water Wisteria','plants','Stem Plant',240,'A leafy, adaptable stem plant that adds a fresh green accent to a planted aquarium.',12,'photo-1497250681960-ef046c08a56e'],
  ['Red Ludwigia','plants','Stem Plant',260,'A colourful stem plant that can bring warm red tones to a well-lit planted aquarium.',10,'https://i.ebayimg.com/images/g/bKgAAOSwLetmbLJu/s-l400.jpg'],
  ['Floating Water Lettuce','plants','Floating Plant',220,'A floating rosette plant that provides gentle shade and shelter for aquarium inhabitants.',8,'photo-1500382017468-9049fed747ef'],
  ['Glass Aquarium Tank','aquarium','Tank',4500,'A clear glass aquarium tank for planning a beautiful freshwater setup.',5,'https://lfs-aquarium.com/cdn/shop/products/134_2048x.jpg?v=1574648713'],
  ['Aquarium Sand','aquarium','Substrate',650,'Fine aquarium sand for a clean, natural-looking base in compatible freshwater setups.',20,'photo-1500530855697-b586d89ba3ee'],
  ['Decorative Aquarium Gravel','aquarium','Substrate',420,'Washed decorative gravel to add colour and texture to your aquarium floor.',24,'photo-1518837695005-2083093ee35b'],
  ['Aquarium Driftwood','aquarium','Hardscape',950,'A natural-looking hardscape accent that creates structure and hiding places.',7,'photo-1511497584788-876760111969'],
  ['Artificial Aquarium Plants','aquarium','Decoration',280,'Low-maintenance artificial greenery for adding colour and cover to an aquarium.',15,'https://ireland.apollo.olxcdn.com/v1/files/hc4f7sn8kfpq1-UA/image%3Bs%3D1587x940'],
  ['Premium Fish Food','aquarium','Fish Care',350,'A convenient staple food for everyday feeding; choose according to your fish species.',20,'photo-1589923188900-85dae523342b'],
  ['Aquarium Water Conditioner','aquarium','Water Care',280,'A water-treatment essential to prepare tap water for aquarium use; follow its label.',18,'photo-1602143407151-7111542de6e8'],
  ['Aquarium Internal Filter','aquarium','Filtration',1250,'A compact internal filter to support mechanical and biological filtration.',8,'photo-1581092160562-40aa08e78837'],
  ['LED Aquarium Light','aquarium','Lighting',1600,'An energy-conscious aquarium light to illuminate your aquatic display.',9,'photo-1519608487953-e999c86e7455'],
  ['Aquarium Air Pump','aquarium','Aeration',850,'A compact air pump for driving aquarium air stones and adding water movement.',11,'https://aquaticvision.ae/cdn/shop/files/6DA25427-E18A-46AC-887B-6ABD0B03C8A2.jpg?v=1709475349'],
];

const slugify = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product';

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required (value not shown).');
  await mongoose.connect(process.env.MONGODB_URI);
  const operations = products.map(([name, category, subcategory, price, description, stock, image]) => ({
    updateOne: {
      filter: { slug: slugify(name) },
      update: { $setOnInsert: {
        name, slug: slugify(name), category, subcategory, price, description,
        isSamplePrice: true, images: [{ url: photo(image) }], stock,
        isAvailable: true, isFeatured: false,
      } },
      upsert: true,
    },
  }));
  const result = await Product.bulkWrite(operations, { ordered: false });
  console.log(`Product seed complete: ${result.upsertedCount} added; existing products preserved.`);
  const counts = await Product.aggregate([{ $match: { slug: { $in: products.map(([name]) => slugify(name)) } } }, { $group: { _id: '$category', count: { $sum: 1 } } }]);
  for (const category of ['fish', 'plants', 'aquarium']) {
    console.log(`${category}: ${counts.find(item => item._id === category)?.count || 0}/10 seeded products present`);
  }
}

seed().catch(error => {
  console.error(`Product seed failed (${error.name || 'Error'}${error.code ? `, code ${error.code}` : ''}); check database connectivity and server/.env.`);
  process.exitCode = 1;
}).finally(async () => {
  if (mongoose.connection.readyState) await mongoose.disconnect();
});
