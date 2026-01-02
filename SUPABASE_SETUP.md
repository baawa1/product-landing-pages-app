# Supabase Setup Guide

This guide will help you set up Supabase for storing orders from your product landing pages.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project name**: `baawa-accessories` (or your preferred name)
   - **Database password**: Create a strong password (save this!)
   - **Region**: Choose closest to Nigeria (EU West - London recommended)
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

## 2. Create the Orders Table

1. Go to your project dashboard
2. Click "Table Editor" in the left sidebar
3. Click "Create a new table"
4. Use these settings:

**Table name**: `orders`

**Columns** (add these columns):

| Column Name | Type | Default Value | Extra Settings |
|------------|------|---------------|----------------|
| `id` | uuid | `gen_random_uuid()` | Primary, Unique |
| `created_at` | timestamptz | `now()` | - |
| `full_name` | text | - | Not nullable |
| `phone` | text | - | Not nullable |
| `email` | text | - | Nullable |
| `state` | text | - | Not nullable |
| `address` | text | - | Not nullable |
| `product_name` | text | - | Not nullable |
| `color` | text | - | Not nullable |
| `quantity` | int4 | `1` | Not nullable |
| `price` | float8 | - | Not nullable |
| `total_price` | float8 | - | Not nullable |
| `discount` | text | - | Nullable |
| `status` | text | `'pending'` | Not nullable |

5. Click "Save" to create the table

## 3. Get Your API Credentials

1. Go to "Project Settings" (gear icon) in the left sidebar
2. Click "API" in the settings menu
3. You'll see:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
4. Copy both of these - you'll need them next!

## 4. Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Go to **Project Settings → API** in Supabase and copy:
   - **Project URL**
   - **anon public** key
   - **service_role secret** key (this is different from anon key!)

3. Add your Supabase credentials to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. Replace the placeholder values with your actual keys from step 2
5. Save the file

**IMPORTANT**:
- Never commit `.env.local` to GitHub! It's already in `.gitignore`.
- The `service_role` key bypasses RLS and should NEVER be exposed to the client - keep it secret!

## 5. Set Up Row Level Security (RLS)

For security, let's allow inserts but protect the data:

1. Go to "Authentication" → "Policies" in Supabase
2. Find your `orders` table
3. Click "New Policy"
4. Select "Insert" policy
5. Name it: `Allow public to insert orders`
6. Set it to `true` for public inserts
7. Click "Save"

Alternatively, you can run this SQL in the SQL Editor:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders
CREATE POLICY "Allow public inserts" ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view orders (for your admin later)
CREATE POLICY "Allow authenticated to read" ON orders
  FOR SELECT
  TO authenticated
  USING (true);
```

## 6. Test Your Setup

1. Run your development server:
```bash
npm run dev
```

2. Go to your MEGIR product page
3. Fill out the order form
4. Submit it
5. Check your Supabase dashboard → Table Editor → orders
6. You should see your test order!

## 7. View Your Orders

### In Supabase Dashboard:
1. Go to "Table Editor"
2. Click on "orders" table
3. You'll see all orders with filters and export options

### Export to CSV:
1. In Table Editor, click the "..." menu
2. Select "Download as CSV"
3. Open in Excel/Google Sheets

## 8. Optional: Set Up Analytics

Add these to your `.env.local` file:

```env
# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX
```

Get these IDs from:
- **Google Analytics**: [analytics.google.com](https://analytics.google.com)
- **Google Tag Manager**: [tagmanager.google.com](https://tagmanager.google.com)
- **Facebook Pixel**: [business.facebook.com/events_manager](https://business.facebook.com/events_manager)

## 9. Production Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your site

## Troubleshooting

**Orders not saving?**
- Check your `.env.local` file has correct values
- Make sure RLS policies are set up
- Check browser console for errors

**Can't see orders in Supabase?**
- Refresh the Table Editor page
- Check you're looking at the correct project
- Verify RLS policies allow viewing

**Need help?**
- Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Or contact support

---

Your orders are now being saved to Supabase! 🎉
