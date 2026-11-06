/* All the static data lives here, away from the UI code.
   (Before: these were globals at the top of script.js.) */

export const photo = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=720&q=82`;

export const pics = {
  Biryani: ['photo-1563379091339-03246963d96c','photo-1633945274405-b6c8069047b0','photo-1589302168068-964664d93dc0','photo-1512058564366-18510be2db19','photo-1603894584373-5ac82b2ae398','photo-1567188040759-fb8a883dc6d8','photo-1631515243349-e0cb75fb8d3a','photo-1599043513900-ed6fe01d3833','photo-1563379091339-03246963d96c','photo-1633945274405-b6c8069047b0'],
  Tiffins: ['photo-1589301760014-d929f3979dbc','photo-1630383249896-424e482df921','photo-1668236543090-82eba5ee5976','photo-1601050690597-df0568f70950','photo-1626132647523-66f5bf380027','photo-1630383249896-424e482df921','photo-1589301760014-d929f3979dbc','photo-1668236543090-82eba5ee5976','photo-1601050690597-df0568f70950','photo-1626132647523-66f5bf380027'],
  Snacks: ['photo-1601050690597-df0568f70950','photo-1604908176997-125f25cc6f3d','photo-1626777552726-4a6b54c97e46','photo-1567337710282-00832b415979','photo-1601050690117-94f5f6fa8bd7','photo-1604908176997-125f25cc6f3d','photo-1626777552726-4a6b54c97e46','photo-1567337710282-00832b415979','photo-1601050690117-94f5f6fa8bd7','photo-1601050690597-df0568f70950'],
  Desserts: ['photo-1578985545062-69928b1d9587','photo-1563805042-7684c019e1cb','photo-1488477181946-6428a0291777','photo-1563805042-7684c019e1cb','photo-1578985545062-69928b1d9587','photo-1563805042-7684c019e1cb','photo-1488477181946-6428a0291777','photo-1578985545062-69928b1d9587','photo-1563805042-7684c019e1cb','photo-1488477181946-6428a0291777'],
  Dinner: Array(10).fill('photo-1547592180-85f173990554')
};

const raw = [
  ['Chicken Dum Biryani','Biryani',180,'Fragrant basmati rice layered with tender chicken.'],
  ['Hyderabadi Mutton Biryani','Biryani',280,'Slow-cooked dum biryani with aromatic spices.'],
  ['Vijayawada Boneless Biryani','Biryani',220,'Andhra-style spicy boneless chicken biryani.'],
  ['Paneer Tikka Biryani','Biryani',190,'Smoky paneer tikka with long-grain rice.'],
  ['Egg Dum Biryani','Biryani',150,'Boiled eggs tucked into masala rice.'],
  ['Prawns Biryani','Biryani',260,'Coastal-style prawns and fragrant rice.'],
  ['Veg Special Biryani','Biryani',150,'Seasonal vegetables and signature masala.'],
  ['Mushroom Biryani','Biryani',170,'Mushrooms cooked with aromatic basmati rice.'],
  ['Paneer Biryani','Biryani',180,'Soft paneer cubes with rich dum flavours.'],
  ['Ulavacharu Chicken Biryani','Biryani',250,'A signature Andhra-style biryani.'],

  ['Masala Dosa','Tiffins',80,'Crisp dosa with spiced potato filling.'],
  ['Plain Dosa','Tiffins',55,'Golden, paper-thin dosa with chutneys.'],
  ['Ghee Karam Dosa','Tiffins',95,'Dosa finished with ghee and spicy karam.'],
  ['Onion Rava Dosa','Tiffins',90,'Lacy semolina dosa with onion and chilli.'],
  ['Idli Sambar (3 pcs)','Tiffins',60,'Soft idlis with sambar and chutney.'],
  ['Medu Vada (2 pcs)','Tiffins',65,'Crispy outside, fluffy inside lentil vada.'],
  ['Mysore Bonda','Tiffins',55,'Soft, fluffy South Indian fritters.'],
  ['Pesarattu','Tiffins',85,'Andhra green-gram dosa with ginger chutney.'],
  ['Poori with Aloo Curry','Tiffins',90,'Puffed pooris with potato curry.'],
  ['Pongal with Chutney','Tiffins',75,'Peppery rice-lentil pongal.'],

  ['Chicken 65','Snacks',170,'Crispy, spicy boneless chicken bites.'],
  ['Paneer 65','Snacks',150,'Golden paneer tossed in lively masala.'],
  ['Gobi Manchurian','Snacks',120,'Crispy cauliflower in Indo-Chinese sauce.'],
  ['Crispy Corn Pepper Salt','Snacks',130,'Crunchy corn tossed with pepper and herbs.'],
  ['Chilli Chicken','Snacks',180,'A popular spicy Indo-Chinese starter.'],
  ['Apollo Fish','Snacks',220,'Crispy fish tossed with curry leaves.'],
  ['Veg Spring Rolls','Snacks',110,'Crunchy rolls filled with seasoned vegetables.'],
  ['Peri Peri French Fries','Snacks',90,'Golden fries with peri-peri seasoning.'],
  ['Chicken Popcorn','Snacks',140,'Bite-sized crispy chicken pieces.'],
  ['Onion Pakoda','Snacks',70,'Crispy onion fritters.'],

  ['Gulab Jamun (2 pcs)','Desserts',60,'Warm dumplings in sugar syrup.'],
  ['Double Ka Meetha','Desserts',100,'Hyderabadi bread pudding with nuts.'],
  ['Qubani Ka Meetha','Desserts',120,'Apricot dessert served in royal style.'],
  ['Chocolate Brownie','Desserts',135,'Rich brownie with a soft centre.'],
  ['Rasmalai (2 pcs)','Desserts',90,'Soft cheese patties in saffron milk.'],
  ['Mango Kulfi','Desserts',75,'Creamy frozen mango dessert.'],
  ['Caramel Custard','Desserts',85,'Silky baked custard with caramel.'],
  ['Chocolate Lava Cake','Desserts',145,'Warm cake with molten chocolate centre.'],
  ['Fruit Salad with Ice Cream','Desserts',110,'Seasonal fruit with ice cream.'],
  ['Sweet Lassi','Desserts',65,'Chilled yoghurt drink.'],

  ['Butter Chicken with Naan','Dinner',260,'Creamy tomato chicken curry with naan.'],
  ['Paneer Butter Masala with Roti','Dinner',210,'Paneer in buttery tomato gravy.'],
  ['Kadai Chicken with Rice','Dinner',240,'Chicken cooked with peppers and kadai spices.'],
  ['Dal Tadka with Jeera Rice','Dinner',160,'Comforting yellow dal with cumin rice.'],
  ['Mutton Rogan Josh with Rice','Dinner',290,'Slow-cooked aromatic mutton curry.'],
  ['Veg Fried Rice','Dinner',140,'Wok-tossed rice with fresh vegetables.'],
  ['Chicken Hakka Noodles','Dinner',170,'Noodles tossed with chicken and vegetables.'],
  ['Tandoori Roti Basket','Dinner',70,'Freshly baked whole-wheat rotis.'],
  ['Fish Curry with Steamed Rice','Dinner',230,'Coastal fish curry with steamed rice.'],
  ['Veg Pulao with Raita','Dinner',150,'Vegetable rice with cooling raita.']
];

export const NONVEG = /chicken|mutton|prawn|egg|fish|apollo/i;

export const DEFAULT_MENU = raw.map((a, i) => ({
  id: i + 1,
  name: a[0],
  category: a[1],
  price: a[2],
  description: a[3],
  available: true,
  veg: !NONVEG.test(a[0]),
  image: photo(pics[a[1]][i % 10])
}));

export const CATEGORIES = ['All', 'Biryani', 'Tiffins', 'Snacks', 'Desserts', 'Dinner'];

export const STAGES = ['PLACED', 'PREPARING', 'READY FOR PICKUP', 'OUT FOR DELIVERY', 'DELIVERED'];

export const STAGE_LABEL = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  'READY FOR PICKUP': 'Ready',
  'OUT FOR DELIVERY': 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};
