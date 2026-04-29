const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const code = fs.readFileSync('c:/Users/BERCHARD/Desktop/SWIFTSERVE/SWIFTSERVE/frontend/src/supabaseClient.js', 'utf8');
const urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = code.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  fetch(urlMatch[1] + '/rest/v1/?apikey=' + keyMatch[1])
    .then(r => r.json())
    .then(data => {
      const p = data.definitions.products.properties;
      console.log(JSON.stringify(p, null, 2));
      process.exit(0);
    });
} else {
  console.log('Could not find credentials');
  process.exit(1);
}
