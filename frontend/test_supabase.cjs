const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const code = fs.readFileSync('c:/Users/BERCHARD/Desktop/SWIFTSERVE/SWIFTSERVE/frontend/src/supabaseClient.js', 'utf8');
const urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = code.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  
  const testProduct = {
      name: 'Test Product',
      description: 'Test',
      price: 10,
      original_price: null,
      image: '',
      vendor: 'Test',
      category: 'MEALS',
      rating: null,
      in_stock: true,
      stock_quantity: 10
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
