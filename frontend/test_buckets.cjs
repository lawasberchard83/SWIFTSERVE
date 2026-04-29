const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const code = fs.readFileSync('c:/Users/BERCHARD/Desktop/SWIFTSERVE/SWIFTSERVE/frontend/src/supabaseClient.js', 'utf8');
const urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = code.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.storage.listBuckets().then(res => {
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
  });
} else {
  console.log('Could not find credentials');
  process.exit(1);
}
