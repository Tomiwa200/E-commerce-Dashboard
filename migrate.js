require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing variables in .env.local. Service role key required.");
  process.exit(1);
}

// Bypasses Row Level Security to safely read and update all table fields
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateExternalImages() {
  console.log('🔄 Fetching products containing external image URLs...');

  // 1. Fetch your current products where the image is still an external link
  // Assumes external urls contain 'http' and have not been converted to your bucket's domain yet
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name, image_url')
    .ilike('image_url', 'http%')
    .not('image_url', 'ilike', `%${supabaseUrl}%`);

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError.message);
    return;
  }

  if (!products || products.length === 0) {
    console.log('✅ No products found requiring image migration.');
    return;
  }

  console.log(`📦 Found ${products.length} products to process.\n`);

  for (const product of products) {
    console.log(`Processing: "${product.name}" (ID: ${product.id})`);
    console.log(`🔗 External Link: ${product.image_url}`);

    try {
      // 2. Fetch the external image file data over the network as a Buffer
      const response = await fetch(product.image_url);
      if (!response.ok) {
        throw new Error(`HTTP status response failure: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      // Determine content type header metadata dynamically
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      // Determine file extension from path or content type
      const extension = contentType.split('/')[1] || 'jpg';
      const storagePath = `migrated-products/${product.id}_${Date.now()}.${extension}`;

      console.log(`📤 Uploading image buffer to bucket location: ${storagePath}...`);

      // 3. Upload image directly to your Supabase Storage bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(storagePath, fileBuffer, {
          contentType: contentType,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 4. Retrieve the permanent new Public URL string
      const { data: { publicUrl } } = supabase.storage

        .from('product-images')
        .getPublicUrl(storagePath);

      console.log(`📥 Updating database row with public URL: ${publicUrl}`);

      // 5. Save the bucket URL directly back into the product row
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', product.id);

      if (updateError) throw updateError;

      console.log(`✅ Successfully migrated: "${product.name}"\n`);

    } catch (err) {
      console.error(`❌ Failed migrating item ID ${product.id}:`, err.message, `\n`);
    }
  }

  console.log('🏁 Migration process completed!');
}

migrateExternalImages();
