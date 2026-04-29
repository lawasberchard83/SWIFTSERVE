const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const code = fs.readFileSync('c:/Users/BERCHARD/Desktop/SWIFTSERVE/SWIFTSERVE/frontend/src/supabaseClient.js', 'utf8');
const urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = code.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  
  // Create a 2MB string
  const largeString = 'a'.repeat(2 * 1024 * 1024);

  const testProduct = {
      name: 'Large Image Test',
      description: '',
      price: 0,
      original_price: null,
      image: largeString,
      vendor: '',
      category: 'MEALS',
      rating: null,
      in_stock: true,
      stock_quantity: 0
  };

  supabase.from('products').insert([testProduct]).then(res => {
      console.log("INSERT RESULT:");
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
  });
} else {
  console.log('Could not find credentials');
  process.exit(1);
}
